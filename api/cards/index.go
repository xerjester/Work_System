package cards

import (
	"context"
	"encoding/json"
	"fmt"
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

	ctx := context.Background()

	if r.Method == "PUT" {
		var c Card
		if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}
		imgsJSON, _ := json.Marshal(c.Images)
		_, err := db.Pool.Exec(ctx, 
			`UPDATE cards SET list_id=$1, title=$2, description=$3, images=$4, date=$5 WHERE id=$6`,
			c.ListID, c.Title, c.Description, imgsJSON, c.Date, c.ID,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, `{"status":"updated"}`)
		return
	}

	if r.Method == "POST" {
		var c Card
		if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}
		if c.ID == "" {
			c.ID = fmt.Sprintf("%d", int64(rand.Intn(1000000))+time.Now().Unix())
		}
		imgsJSON, _ := json.Marshal(c.Images)
		if string(imgsJSON) == "null" {
			imgsJSON = []byte("[]")
		}
		_, err := db.Pool.Exec(ctx, 
			`INSERT INTO cards (id, list_id, title, description, images, date, position) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
			c.ID, c.ListID, c.Title, c.Description, imgsJSON, c.Date, 99,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, `{"status":"created", "id": "%s"}`, c.ID)
		return
	}

	if r.Method == "DELETE" {
		id := r.URL.Query().Get("id")
		if id == "" {
			http.Error(w, "Missing id parameter", http.StatusBadRequest)
			return
		}
		_, err := db.Pool.Exec(ctx, `DELETE FROM cards WHERE id=$1`, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, `{"status":"deleted"}`)
		return
	}

	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}
