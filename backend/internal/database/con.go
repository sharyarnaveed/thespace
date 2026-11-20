package database

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
)

var DB *pgx.Conn

func Connect() {
	connString := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	config, err := pgx.ParseConfig(connString)
	if err != nil {
		log.Fatal(err)
	}
	config.DefaultQueryExecMode = pgx.QueryExecModeExec

	DB, err = pgx.ConnectConfig(context.Background(), config)
	if err != nil {
		log.Fatal(err)
	}

	err = DB.Ping(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	log.Println("✅ Connected to PostgreSQL")
}
