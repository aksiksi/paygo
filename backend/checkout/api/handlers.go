package api

import (
	"net/http"

	"go.uber.org/zap"
)

type ChargeHandler struct {
	logger *zap.SugaredLogger
}

func NewChargeHandler(logger *zap.SugaredLogger) *ChargeHandler {
	return &ChargeHandler{
		logger,
	}
}

func (h *ChargeHandler) AddCharge(resp http.ResponseWriter, req *http.Request) {
	charge, err := NewChargeFromJson(req.Body)
	if err != nil {
		h.logger.Errorw("failed to parse charge from JSON", "err", err)
		setHttpError(err, "Invalid charge provided", http.StatusBadRequest, resp)
		return
	}

	h.logger.Infow("got valid charge", "charge", charge)
}

func (h *ChargeHandler) DeleteCharge(resp http.ResponseWriter, req *http.Request) {

}

func (h *ChargeHandler) GetCharge(resp http.ResponseWriter, req *http.Request) {

}

type PaymentHandler struct {
	logger *zap.SugaredLogger
}

func NewPaymentHandler(logger *zap.SugaredLogger) *PaymentHandler {
	return &PaymentHandler{
		logger,
	}
}

func (h *PaymentHandler) AddPayment(resp http.ResponseWriter, req *http.Request) {
	payment, err := NewPaymentFromJson(req.Body)
	if err != nil {
		h.logger.Errorw("failed to parse payment from JSON", "err", err)
		setHttpError(err, "Invalid payment provided", http.StatusBadRequest, resp)
		return
	}

	payment.Completed = false

	h.logger.Infow("got valid payment", "payment", payment)
}

func (h *PaymentHandler) DeletePayment(resp http.ResponseWriter, req *http.Request) {

}

func (h *PaymentHandler) GetPayment(resp http.ResponseWriter, req *http.Request) {

}
