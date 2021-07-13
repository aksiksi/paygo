package handlers

import (
	"log"
	"net/http"

	"github.com/aksiksi/paygo/common/data"
	"github.com/aksiksi/paygo/common/db"
	"github.com/gorilla/mux"
)

type Payment struct {
	log *log.Logger
}

func NewPayment(l *log.Logger) *Payment {
	return &Payment{l}
}

func (p *Payment) GetPayment(resp http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	paymentID, found := vars["id"]
	if !found {
		http.Error(resp, "No payment ID provided", http.StatusBadRequest)
		return
	}

	payment, err := db.GetPayment(paymentID)
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

func (p *Payment) PostPayment(resp http.ResponseWriter, req *http.Request) {
	payment, err := data.PaymentFromJson(req.Body)
	if err != nil {
		p.log.Println(err)
		http.Error(resp, "Invalid payment JSON provided", http.StatusBadRequest)
		return
	}

	err = db.SavePayment(payment)
	if err != nil {
		http.Error(resp, "Failed to store payment info", http.StatusInternalServerError)
		return
	}
}
