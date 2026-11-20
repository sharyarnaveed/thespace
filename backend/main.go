package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/sharyarnaveed/thespace/internal/database"
	"github.com/sharyarnaveed/thespace/services"
	"github.com/sharyarnaveed/thespace/utils"
)

type CREATEACCOUNT struct {
	EMAIL           string `json:"email"`
	FULLNAME        string `json:"fullname"`
	PASSWORD        string `json:"password"`
	DOB             string `json:"dob"`
	PASSWORDCONFIRM string `json:"passwordconfirm"`
	AGREE           bool   `json:"agree"`
}
type VERIFYOTP struct {
	EMAIL string `json:"email"`
	OTP   string `json:"otp"`
}

func signupHandler(w http.ResponseWriter, r *http.Request) {
	var req CREATEACCOUNT
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	errr := json.NewDecoder(r.Body).Decode(&req)
	if errr != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate the request data
	if req.EMAIL == "" || req.FULLNAME == "" || req.PASSWORD == "" || req.DOB == "" || req.PASSWORDCONFIRM == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}
	if req.AGREE == false {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	if req.PASSWORD != req.PASSWORDCONFIRM {
		http.Error(w, "Passwords do not match", http.StatusBadRequest)
		return
	}

	success := utils.IsVerified(req.EMAIL)
	if !success {
		http.Error(w, "Invalid email address", http.StatusBadRequest)
		return
	}

	success = utils.IsVerifiedName(req.FULLNAME)
	if !success {
		http.Error(w, "Invalid full name", http.StatusBadRequest)
		return
	}

	message, success := services.CreateAccount(req.EMAIL, req.FULLNAME, req.PASSWORD, req.DOB, req.AGREE)
	w.Header().Set("Content-Type", "application/json")
	if !success {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]any{"success": false, "message": message})
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{"success": true, "message": message})
}

func verifyOtp(w http.ResponseWriter, r *http.Request) {
	var req VERIFYOTP
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	message, success := services.VerifyOtp(req.EMAIL, req.OTP)

	if !success {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]any{"success": false, "message": message})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{"success": true, "message": message})

}

func main() {
	err := godotenv.Load()
	fmt.Println("DB_USER:", os.Getenv("DB_USER"))
	fmt.Println("DB_HOST:", os.Getenv("DB_HOST"))
	fmt.Println("DB_PASSWORD loaded:", os.Getenv("DB_PASSWORD") != "")
	if err != nil {
		log.Fatal(err)
	}

	database.Connect()
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})
	mux.HandleFunc("POST /api/auth/verify-otp", verifyOtp)
	mux.HandleFunc("POST /api/auth/signup", signupHandler)
	log.Println("🚀 Server is running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
