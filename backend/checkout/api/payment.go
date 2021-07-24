package api

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/pkg/errors"
)

type Payment struct {
	// Unique ID for this payment
	Id string `json:"id"`

	// Amount, in minimum unit for the currency
	Amount int64 `json:"amount" validate:"required"`

	// Currency (3 letter ISO code)
	Currency string `json:"currency" validate:"required"`

	Completed bool `json:"completed"`

	ChargeId string `json:"charge_id"`

	// Optional description for this charge
	Description string `json:"description"`
}

func FromCharge(charge *Charge) (*Payment, error) {
	if charge.Payment.Id == "" {
		err := charge.Payment.Validate()
		if err != nil {
			return nil, errors.Errorf("Not a valid Payment: %w", err)
		}
	}

	return &charge.Payment, nil
}

func (p *Payment) Validate() error {
	return Validator.Struct(p)
}

// TODO(aksiksi): Maybe this is a bad idea. The reason is that we
// need to be able to differentiate between a struct built by an
// external request (untrusted) vs. a struct provided by the DB
// or another internal service (trusted).
func (c *Payment) FromJson(r io.Reader) error {
	decoder := json.NewDecoder(r)

	err := decoder.Decode(c)
	if err != nil {
		return errors.Errorf("Invalid payment JSON: %w", err)
	}

	err = c.Validate()
	if err != nil {
		// TODO: Return a specific error type
		return errors.Errorf("Invalid payment: %w", err)
	}

	return nil
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
	payment := &Payment{}

	err := payment.FromJson(req.Body)
	if err != nil {
		http.Error(resp, "Invalid charge provided", http.StatusBadRequest)
	}

	payment.Completed = false

	h.logger.Printf("Got: %+v", payment)
}

func (h *PaymentHandler) DeletePayment(resp http.ResponseWriter, req *http.Request) {

}

func (h *PaymentHandler) GetPayment(resp http.ResponseWriter, req *http.Request) {

}
