package services

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"

	"math/big"

	"github.com/jackc/pgx/v5"
	"github.com/sharyarnaveed/thespace/internal/database"
	"github.com/sharyarnaveed/thespace/utils"
)

func generateOTP() string {
	n, _ := rand.Int(rand.Reader, big.NewInt(1000000))
	return fmt.Sprintf("%06d", n)
}

func CreateAccount(email, fullname, password, dob string, agree bool) (string, bool) {
	var emailexsists string
	var id int64

	err := database.DB.QueryRow(
		context.Background(),
		`SELECT email from users WHERE email=$1`,
		email,
	).Scan(&emailexsists)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		return "", false
	}

	if emailexsists != "" {
		return "Email already exists", false
	}
	hashpassword, success := utils.HashPassword(password)

	if !success {
		return "Error occurred while hashing password", false
	}
	isverifed := false
	err = database.DB.QueryRow(
		context.Background(),
		`INSERT INTO users (email, fullname, password, dob, agree,isverified) VALUES ($1, $2, $3, $4,$5,$6) RETURNING id`,
		email,
		fullname,
		hashpassword,
		dob,
		agree,
		isverifed,
	).Scan(&id)

	if err != nil {
		return "Error occurred while creating account", false
	}

	otp := generateOTP()

	errotpindb := database.DB.QueryRow(
		context.Background(),
		`UPDATE users SET otp = $1 WHERE id = $2`,
		otp,
		id,
	)
	if errotpindb != nil {
		return "failed to send otp", false
	}

	theotpsend := utils.Sendotp(email, otp)
	if !theotpsend {
		return "failed to send the otp", false
	}

	return "Account created successfully", true
}
