package utils

import (
	"net/smtp"
	"os"
)

func Sendotp(to string, otp string) bool {
	host := os.Getenv("EMAIL_HOST")
	port := os.Getenv("EMAIL_PORT")
	hostportitis := host + ":" + port
	pass := os.Getenv("EMAIL_PASS")
	from := os.Getenv("EMAIL_FROM")

	msg := "From: " + from + "\r\n" +
		"To: " + to + "\r\n" +
		"Subject: Your OTP Code\r\n\r\n" +
		"Your OTP is: " + otp

	auth := smtp.PlainAuth("", from, pass, host)
	success := smtp.SendMail(hostportitis, auth, from, []string{to}, []byte(msg))
	if success != nil {
		return false
	}
	return true
}
