package checkout

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/pkg/errors"
)

type Charge struct {
	// Unique ID for this charge (output)
	Id string `json:"id"`

	// Payment to process - either the Id OR remaining fields must
	// be set
	Payment Payment `json:"payment"`

	// PaymentMethod to charge - either the Id OR remaining fields must
	// be set
	PaymentMethod PaymentMethod `json:"payment_method"`

	// Subscription information (ignored if Active == false)
	Subscription struct {
		Active   bool          `json:"active"`
		Interval time.Duration `json:"interval"`
	} `json:"subscription"`

	Refunded       bool   `json:"refunded"`
	Success        bool   `json:"success"`
	CompletionTime int64  `json:"completion_time"`
	ErrorMessage   string `json:"error_message"`
}

func (c *Charge) Validate() error {
	return Validator.Struct(c)
}

func (c *Charge) FromJson(r io.Reader) error {
	decoder := json.NewDecoder(r)

	err := decoder.Decode(c)
	if err != nil {
		return errors.Errorf("Invalid charge JSON: %w", err)
	}

	err = c.Validate()
	if err != nil {
		// TODO: Return a specific error type
		return errors.Errorf("Invalid charge: %w", err)
	}

	return nil
}

type ChargeHandler struct {
	logger *log.Logger
}

func NewChargeHandler(logger *log.Logger) *ChargeHandler {
	return &ChargeHandler{
		logger,
	}
}

func (h *ChargeHandler) AddCharge(resp http.ResponseWriter, req *http.Request) {
	charge := &Charge{}

	err := charge.FromJson(req.Body)
	if err != nil {
		http.Error(resp, "Invalid charge provided", http.StatusBadRequest)
	}

	h.logger.Printf("Got: %+v", charge)
}

func (h *ChargeHandler) DeleteCharge(resp http.ResponseWriter, req *http.Request) {

}

func (h *ChargeHandler) GetCharge(resp http.ResponseWriter, req *http.Request) {

}
