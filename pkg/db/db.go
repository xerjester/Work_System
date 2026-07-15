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

	connString := "postgresql://postgres.asdaptdcvwmvzjnefiah:08779025901@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&statement_cache_capacity=0&default_query_exec_mode=exec"

	ctx := context.Background()
	var err error
	Pool, err = pgxpool.New(ctx, connString)
	if err != nil {
		log.Printf("Unable to create connection pool: %v\n", err)
	}
}
