package api

import (
	"encoding/json"
	"io"
	"time"

	_ "github.com/Rhymond/go-money"
	"github.com/aksiksi/paygo/checkout/lib"
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
	return lib.Validator.Struct(c)
}

func (c *Charge) ToJson(w io.Writer) error {
	enc := json.NewEncoder(w)
	return enc.Encode(c)
}

func NewChargeFromJson(r io.Reader) (*Charge, error) {
	decoder := json.NewDecoder(r)
	charge := Charge{}

	err := decoder.Decode(&charge)
	if err != nil {
		return nil, errors.Errorf("Invalid charge JSON: %w", err)
	}

	err = charge.Validate()
	if err != nil {
		// TODO: Return a specific error type
		return nil, errors.Errorf("Invalid charge: %w", err)
	}

	return &charge, nil
}
