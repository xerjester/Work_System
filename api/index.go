package api

import (
	"context"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"work-system/pkg/db"
)

type Board struct {
	ID    string `json:"id"`
	Title string `json:"title"`
}

type List struct {
	ID       string `json:"id"`
	BoardID  string `json:"board_id"`
	Title    string `json:"title"`
	TitleKey string `json:"titleKey"`
	Position int    `json:"position"`
}

type Card struct {
	ID          string   `json:"id"`
	ListID      string   `json:"list_id"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Images      []string `json:"images"`
	Date        string   `json:"date"`
	Position    int      `json:"position"`
}

type AppData struct {
	Board *Board  `json:"board"`
	Lists []List  `json:"lists"`
	Cards []Card  `json:"cards"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	db.InitDB()

	path := r.URL.Path

	if strings.HasSuffix(path, "/data") || path == "/api" {
		handleData(w, r)
		return
	}

	if strings.HasSuffix(path, "/cards") {
		handleCards(w, r)
		return
	}

	http.NotFound(w, r)
}

func handleData(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	if db.Pool == nil {
		// Fallback mock data when DB connection fails
		w.Write([]byte(`{
			"board": { "id": "1", "title": "Work System Board (Offline)" },
			"lists": [
				{ "id": "1", "board_id": "1", "title": "To Do", "titleKey": "todo", "position": 1 },
				{ "id": "2", "board_id": "1", "title": "In Progress", "titleKey": "inProgress", "position": 2 },
				{ "id": "3", "board_id": "1", "title": "Done", "titleKey": "done", "position": 3 }
			],
			"cards": [
				{ "id": "1", "list_id": "1", "title": "Design landing page", "description": "Offline Mode mock task", "images": [], "date": "22/2/2026", "position": 1 }
			]
		}`))
		return
	}

	ctx := context.Background()

	var board Board
	err := db.Pool.QueryRow(ctx, "SELECT id, title FROM boards LIMIT 1").Scan(&board.ID, &board.Title)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	rows, err := db.Pool.Query(ctx, "SELECT id, board_id, title, title_key, position FROM lists ORDER BY position")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var lists []List
	for rows.Next() {
		var l List
		var tk *string
		if err := rows.Scan(&l.ID, &l.BoardID, &l.Title, &tk, &l.Position); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if tk != nil && *tk != "" {
			l.TitleKey = *tk
		}
		lists = append(lists, l)
	}

	cRows, err := db.Pool.Query(ctx, "SELECT id, list_id, title, description, images, date, position FROM cards ORDER BY position")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cRows.Close()

	var cards []Card
	for cRows.Next() {
		var c Card
		var desc *string
		var date *string
		var imgsJSON []byte
		if err := cRows.Scan(&c.ID, &c.ListID, &c.Title, &desc, &imgsJSON, &date, &c.Position); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if desc != nil {
			c.Description = *desc
		}
		if date != nil {
			c.Date = *date
		}
		if imgsJSON != nil && len(imgsJSON) > 0 && string(imgsJSON) != "null" {
			json.Unmarshal(imgsJSON, &c.Images)
		}
		if c.Images == nil {
			c.Images = make([]string, 0)
		}
		cards = append(cards, c)
	}

	data := AppData{
		Board: &board,
		Lists: lists,
		Cards: cards,
	}

	json.NewEncoder(w).Encode(data)
}

func handleCards(w http.ResponseWriter, r *http.Request) {
	if db.Pool == nil {
		// Offline mode - just return success without saving
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

	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}
