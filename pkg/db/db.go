package db

import (
	"context"
	"log"

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

	// Disable prepared statements for Transaction Pooler compatibility
	config.ConnConfig.DefaultQueryExecMode = pgx.QueryExecModeExec
	config.ConnConfig.StatementCacheCapacity = 0
	config.ConnConfig.DescriptionCacheCapacity = 0

	ctx := context.Background()
	Pool, err = pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		log.Printf("Unable to create connection pool: %v\n", err)
	}
}
