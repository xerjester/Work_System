package main

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	connString := "postgresql://postgres.asdaptdcvwmvzjnefiah:Jobchan273159@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"

	ctx := context.Background()
	db, err := pgxpool.New(ctx, connString)
	if err != nil {
		log.Fatalf("Unable to create connection pool: %v\n", err)
	}
	defer db.Close()

	var id, title string
	err = db.QueryRow(ctx, "SELECT id, title FROM boards LIMIT 1").Scan(&id, &title)
	if err != nil {
		fmt.Printf("Error querying boards: %v\n", err)
	} else {
		fmt.Printf("Board found: %s - %s\n", id, title)
	}
}
