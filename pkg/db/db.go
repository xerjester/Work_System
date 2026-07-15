package db

import (
	"context"
	"log"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func InitDB() {
	if Pool != nil {
		return
	}

	connString := "postgresql://postgres.asdaptdcvwmvzjnefiah:Jobchan273159@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres"

	config, err := pgxpool.ParseConfig(connString)
	if err != nil {
		log.Printf("Unable to parse connection string: %v\n", err)
		return
	}

	// Use simple protocol to avoid prepared statement issues with Transaction Pooler
	config.ConnConfig.DefaultQueryExecMode = pgx.QueryExecModeSimpleProtocol

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	Pool, err = pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		log.Printf("Unable to create connection pool: %v\n", err)
		Pool = nil
	}
}
