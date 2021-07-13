package data

import "time"

type Card struct {
	Number     string
	ExpiryDate time.Time
	Cvv        int
	Name       string
	Address    string
	Country    string
}
