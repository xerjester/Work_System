package cards

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"

	"work-system/pkg/db"
)

type Card struct {
	ID          string   `json:"id"`
	ListID      string   `json:"list_id"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Images      []string `json:"images"`
	Date        string   `json:"date"`
	Position    int      `json:"position"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	// Catch panics
	defer func() {
		if rec := recover(); rec != nil {
			log.Printf("PANIC in cards Handler: %v", rec)
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, `{"status":"error","message":"internal panic: %v"}`, rec)
		}
	}()

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	db.InitDB()
	
	if db.Pool == nil {
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, `{"status":"offline_mock_success"}`)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if r.Method == "PUT" {
		var c Card
		if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Fprintf(w, `{"status":"error","message":"Invalid JSON: %v"}`, err)
			return
		}
		imgsJSON, _ := json.Marshal(c.Images)
		imgsStr := string(imgsJSON)
		if imgsStr == "null" {
			imgsStr = "[]"
		}
		_, err := db.Pool.Exec(ctx, 
			`UPDATE cards SET list_id=$1, title=$2, description=$3, images=$4, date=$5 WHERE id=$6`,
			c.ListID, c.Title, c.Description, imgsStr, c.Date, c.ID,
		)
		if err != nil {
			log.Printf("Error updating card %s: %v", c.ID, err)
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, `{"status":"error","message":"%v"}`, err)
			return
		}
		fmt.Fprintf(w, `{"status":"updated"}`)
		return
	}

	if r.Method == "POST" {
		var c Card
		if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Fprintf(w, `{"status":"error","message":"Invalid JSON: %v"}`, err)
			return
		}
		if c.ID == "" {
			c.ID = fmt.Sprintf("%d", rand.Intn(900000)+100000)
		}
		imgsJSON, _ := json.Marshal(c.Images)
		imgsStr := string(imgsJSON)
		if imgsStr == "null" {
			imgsStr = "[]"
		}
		_, err := db.Pool.Exec(ctx, 
			`INSERT INTO cards (id, list_id, title, description, images, date, position) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
			c.ID, c.ListID, c.Title, c.Description, imgsStr, c.Date, 99,
		)
		if err != nil {
			log.Printf("Error creating card: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, `{"status":"error","message":"%v"}`, err)
			return
		}
		fmt.Fprintf(w, `{"status":"created", "id": "%s"}`, c.ID)
		return
	}

	if r.Method == "DELETE" {
		id := r.URL.Query().Get("id")
		if id == "" {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Fprintf(w, `{"status":"error","message":"Missing id parameter"}`)
			return
		}
		_, err := db.Pool.Exec(ctx, `DELETE FROM cards WHERE id=$1`, id)
		if err != nil {
			log.Printf("Error deleting card %s: %v", id, err)
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, `{"status":"error","message":"%v"}`, err)
			return
		}
		fmt.Fprintf(w, `{"status":"deleted"}`)
		return
	}

	w.WriteHeader(http.StatusMethodNotAllowed)
	fmt.Fprintf(w, `{"status":"error","message":"Method not allowed"}`)
}
