package lists

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

type ListPayload struct {
	ID       string `json:"id"`
	BoardID  string `json:"board_id"`
	Title    string `json:"title"`
	Position int    `json:"position"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	defer func() {
		if rec := recover(); rec != nil {
			log.Printf("PANIC in lists Handler: %v", rec)
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

	if r.Method == "POST" {
		var l ListPayload
		if err := json.NewDecoder(r.Body).Decode(&l); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Fprintf(w, `{"status":"error","message":"Invalid JSON"}`)
			return
		}
		if l.ID == "" {
			l.ID = fmt.Sprintf("%d", rand.Intn(900000)+100000)
		}
		
		_, err := db.Pool.Exec(ctx, 
			`INSERT INTO lists (id, board_id, title, position) VALUES ($1, $2, $3, $4)`,
			l.ID, l.BoardID, l.Title, 99,
		)
		if err != nil {
			log.Printf("Error creating list: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, `{"status":"error","message":"%v"}`, err)
			return
		}
		fmt.Fprintf(w, `{"status":"created", "id": "%s"}`, l.ID)
		return
	}

	if r.Method == "PUT" {
		var l ListPayload
		if err := json.NewDecoder(r.Body).Decode(&l); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Fprintf(w, `{"status":"error","message":"Invalid JSON"}`)
			return
		}
		_, err := db.Pool.Exec(ctx, `UPDATE lists SET title=$1, title_key=NULL WHERE id=$2`, l.Title, l.ID)
		if err != nil {
			log.Printf("Error updating list %s: %v", l.ID, err)
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, `{"status":"error","message":"%v"}`, err)
			return
		}
		fmt.Fprintf(w, `{"status":"updated"}`)
		return
	}

	if r.Method == "DELETE" {
		id := r.URL.Query().Get("id")
		if id == "" {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Fprintf(w, `{"status":"error","message":"Missing id parameter"}`)
			return
		}
		// First delete associated cards
		_, _ = db.Pool.Exec(ctx, `DELETE FROM cards WHERE list_id=$1`, id)
		_, err := db.Pool.Exec(ctx, `DELETE FROM lists WHERE id=$1`, id)
		if err != nil {
			log.Printf("Error deleting list %s: %v", id, err)
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
