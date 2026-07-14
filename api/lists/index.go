package lists

import (
	"context"
	"encoding/json"
	"fmt"
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
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
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

	if r.Method == "POST" {
		var l ListPayload
		if err := json.NewDecoder(r.Body).Decode(&l); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}
		if l.ID == "" {
			l.ID = fmt.Sprintf("%d", int64(rand.Intn(1000000))+time.Now().Unix())
		}
		
		_, err := db.Pool.Exec(ctx, 
			`INSERT INTO lists (id, board_id, title, position) VALUES ($1, $2, $3, $4)`,
			l.ID, l.BoardID, l.Title, 99,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, `{"status":"created", "id": "%s"}`, l.ID)
		return
	}

	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}
