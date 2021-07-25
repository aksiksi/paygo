package api

import (
	"log"
	"net/http"
)

type ChargeHandler struct {
	logger *log.Logger
}

func NewChargeHandler(logger *log.Logger) *ChargeHandler {
	return &ChargeHandler{
		logger,
	}
}

func (h *ChargeHandler) AddCharge(resp http.ResponseWriter, req *http.Request) {
	charge, err := NewChargeFromJson(req.Body)
	if err != nil {
		h.logger.Println(err)
		setHttpError(err, "Invalid charge provided", http.StatusBadRequest, resp)
		return
	}

	h.logger.Printf("Got: %+v", charge)
}

func (h *ChargeHandler) DeleteCharge(resp http.ResponseWriter, req *http.Request) {

}

func (h *ChargeHandler) GetCharge(resp http.ResponseWriter, req *http.Request) {

}

type PaymentHandler struct {
	logger *log.Logger
}

func NewPaymentHandler(logger *log.Logger) *PaymentHandler {
	return &PaymentHandler{
		logger,
	}
}

func (h *PaymentHandler) AddPayment(resp http.ResponseWriter, req *http.Request) {
	payment, err := NewPaymentFromJson(req.Body)
	if err != nil {
		h.logger.Println(err)
		setHttpError(err, "Invalid payment provided", http.StatusBadRequest, resp)
		return
	}

	payment.Completed = false

	h.logger.Printf("Got: %+v", payment)
}

func (h *PaymentHandler) DeletePayment(resp http.ResponseWriter, req *http.Request) {

}

func (h *PaymentHandler) GetPayment(resp http.ResponseWriter, req *http.Request) {

}
