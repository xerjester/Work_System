package images

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"work-system/pkg/db"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	cardID := r.URL.Query().Get("id")
	if cardID == "" {
		w.Write([]byte(`{"images":[]}`))
		return
	}

	db.InitDB()

	if db.Pool == nil {
		w.Write([]byte(`{"images":[]}`))
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var imgsJSON []byte
	err := db.Pool.QueryRow(ctx, "SELECT images FROM cards WHERE id=$1", cardID).Scan(&imgsJSON)
	if err != nil {
		w.Write([]byte(`{"images":[]}`))
		return
	}

	var images []string
	if imgsJSON != nil && len(imgsJSON) > 0 && string(imgsJSON) != "null" {
		json.Unmarshal(imgsJSON, &images)
	}
	if images == nil {
		images = make([]string, 0)
	}

	result := map[string][]string{"images": images}
	json.NewEncoder(w).Encode(result)
}
