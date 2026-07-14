package main

import (
	"log"
	"net/http"

	"work-system/api/cards"
	"work-system/api/data"
	"work-system/api/lists"
)

func main() {
	http.HandleFunc("/api/data", data.Handler)
	http.HandleFunc("/api/cards", cards.Handler)
	http.HandleFunc("/api/lists", lists.Handler)
	
	log.Println("Local Go API server listening on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
