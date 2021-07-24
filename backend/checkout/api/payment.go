package api

import (
	"encoding/json"
	"io"

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

func (p *Payment) ToJson(w io.Writer) error {
	enc := json.NewEncoder(w)
	return enc.Encode(p)
}

// TODO(aksiksi): Maybe this is a bad idea. The reason is that we
// need to be able to differentiate between a struct built by an
// external request (untrusted) vs. a struct provided by the DB
// or another internal service (trusted).
func NewPaymentFromJson(r io.Reader) (*Payment, error) {
	decoder := json.NewDecoder(r)
	payment := Payment{}

	err := decoder.Decode(&payment)
	if err != nil {
		return nil, errors.Errorf("Invalid payment JSON: %w", err)
	}

	err = payment.Validate()
	if err != nil {
		// TODO: Return a specific error type
		return nil, errors.Errorf("Invalid payment: %w", err)
	}

	return &payment, nil
}
