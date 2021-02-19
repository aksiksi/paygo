package handlers

import (
	"log"
	"net/http"

	"github.com/aksiksi/paygo/db"
	"github.com/gorilla/mux"
)

type Payment struct {
	log *log.Logger
}

func NewPayment(l *log.Logger) *Payment {
	return &Payment{l}
}

func (p *Payment) GetPayments(resp http.ResponseWriter, req *http.Request) {
	resp.WriteHeader(200)
}

func (p *Payment) GetPayment(resp http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	paymentId, found := vars["id"]
	if !found {
		http.Error(resp, "No payment ID provided", http.StatusBadRequest)
		return
	}

	payment, err := db.GetPayment(paymentId)
	if err != nil {
		http.Error(resp, "Payment ID not found", http.StatusNotFound)
		return
	}

	err = payment.ToJson(resp)
	if err != nil {
		p.log.Fatal("Failed to serialize payment to JSON")
		http.Error(resp, "Internal error", http.StatusInternalServerError)
		return
	}
}
