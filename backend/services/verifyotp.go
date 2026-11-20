package services

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/sharyarnaveed/thespace/internal/database"
)

func VerifyOtp(email, otp string) (string, bool) {

	var dbotp string

	err := database.DB.QueryRow(
		context.Background(),
		`SELECT otp FROM users WHERE email=$1`,
		email,
	).Scan(&dbotp)

	if errors.Is(err, pgx.ErrNoRows) {
		return "User not found", false
	}

	if dbotp != otp {
		return "Invalid Otp", false
	}

	return "Otp verified", true

}
