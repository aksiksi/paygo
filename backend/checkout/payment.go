package checkout

import "github.com/pkg/errors"

type Payment struct {
	// Unique ID for this payment
	Id string `json:"id"`

	// Amount, in minimum unit for the currency
	Amount int64 `json:"amount"`

	// Currency (3 letter ISO code)
	Currency string `json:"currency"`

	Completed bool `json:"completed"`

	ChargeId string `json:"charge_id"`

	// Optional description for this charge
	Description string `json:"description"`
}

func FromCharge(charge *Charge) (*Payment, error) {
	if charge.Payment.Id == "" && !charge.Payment.IsValid() {
		return nil, errors.New("Not a valid Payment")
	}

	return &charge.Payment, nil
}

func (payment *Payment) IsValid() bool {
	return payment.Amount == 0 || payment.Currency == ""
}
