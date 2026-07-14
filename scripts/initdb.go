package main

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	connString := "postgresql://postgres.asdaptdcvwmvzjnefiah:08779025901@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"

	// Connect to database
	ctx := context.Background()
	db, err := pgxpool.New(ctx, connString)
	if err != nil {
		log.Fatalf("Unable to create connection pool: %v\n", err)
	}
	defer db.Close()

	// DDL Queries
	queries := []string{
		`DROP TABLE IF EXISTS cards;`,
		`DROP TABLE IF EXISTS lists;`,
		`DROP TABLE IF EXISTS boards;`,
		`
		CREATE TABLE boards (
			id VARCHAR(50) PRIMARY KEY,
			title VARCHAR(255) NOT NULL
		);
		`,
		`
		CREATE TABLE lists (
			id VARCHAR(50) PRIMARY KEY,
			board_id VARCHAR(50) REFERENCES boards(id) ON DELETE CASCADE,
			title VARCHAR(255),
			title_key VARCHAR(50),
			position INT
		);
		`,
		`
		CREATE TABLE cards (
			id VARCHAR(50) PRIMARY KEY,
			list_id VARCHAR(50) REFERENCES lists(id) ON DELETE CASCADE,
			title VARCHAR(255) NOT NULL,
			description TEXT,
			images JSONB DEFAULT '[]'::jsonb,
			date VARCHAR(50),
			position INT
		);
		`,
	}

	for _, query := range queries {
		_, err := db.Exec(ctx, query)
		if err != nil {
			log.Fatalf("Query execution failed: %v\nQuery: %s", err, query)
		}
	}

	fmt.Println("Tables created successfully.")

	// Insert Seed Data
	seedQueries := []string{
		`INSERT INTO boards (id, title) VALUES ('1', 'Main Board');`,
		`INSERT INTO lists (id, board_id, title, title_key, position) VALUES 
			('1', '1', 'To Do', 'todo', 1),
			('2', '1', 'In Progress', 'inProgress', 2),
			('3', '1', 'Done', 'done', 3);`,
		`INSERT INTO cards (id, list_id, title, description, images, date, position) VALUES 
			('1', '1', 'Design landing page', 'Create mockups for the new landing page using Figma.', '[]', '22/2/2026', 1),
			('2', '1', 'Write copy', 'Draft the main headlines and benefits.', '[]', '22/2/2026', 2),
			('3', '2', 'Setup database', 'Initialize Supabase and create tables.', '[]', '22/2/2026', 1),
			('4', '3', 'Project planning', 'Define MVP scope and tasks.', '[]', '22/2/2026', 1);`,
	}

	for _, query := range seedQueries {
		_, err := db.Exec(ctx, query)
		if err != nil {
			log.Fatalf("Seed Query execution failed: %v\nQuery: %s", err, query)
		}
	}

	fmt.Println("Seed data inserted successfully.")
}
