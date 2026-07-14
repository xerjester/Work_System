package main

import (
	"log"
	"net/http"

	"work-system/api"
)

func main() {
	// Provide a local server for testing the Vercel functions
	http.HandleFunc("/api/data", api.Handler)
	http.HandleFunc("/api/cards", api.Handler)
	
	log.Println("Local Go API server listening on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
