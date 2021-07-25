package api

import (
	"encoding/json"
	"fmt"
	"io"
	"time"

	_ "github.com/Rhymond/go-money"
	"github.com/aksiksi/paygo/checkout/lib"
	"github.com/go-playground/validator/v10"
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

	Refunded       bool     `json:"refunded"`
	Success        bool     `json:"success"`
	CompletionTime int64    `json:"completion_time"`
	Errors         []string `json:"errors" validate:"omitempty"`
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

	if err := charge.Validate(); err != nil {
		switch err := err.(type) {
		case validator.ValidationErrors:
			for _, e := range err {
				var err error

				if e.Tag() == "required" {
					err = fmt.Errorf("%s must be specified", e.Namespace())
				} else {
					err = fmt.Errorf("%s is invalid (validator: %s)", e.Namespace(), e.Tag())
				}

				return nil, &userVisibleError{err}
			}
		default:
			return nil, &internalError{err}
		}
	}

	return &charge, nil
}
