package db

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func InitDB() {
	if Pool != nil {
		return
	}
	
	connString := "postgresql://postgres.asdaptdcvwmvzjnefiah:08779025901@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"
	
	ctx := context.Background()
	var err error
	Pool, err = pgxpool.New(ctx, connString)
	if err != nil {
		log.Printf("Unable to create connection pool: %v\n", err)
	}
}
