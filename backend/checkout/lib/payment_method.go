package checkout

import "github.com/go-playground/validator/v10"

type PaymentMethod struct {
	Id string `json:"id"`

	// Type of payment method: bank, card, or edinar
	Type string `json:"type" validate:"required"`
	Card *Card  `json:"card,omitempty"`
	//   Bank    *Bank     `json:"bank, omitempty"`
	//   Edinar  *Edinar   `json:"edinar, omitempty"`

	// Billing information
	BillingInfo struct {
		Email string `json:"email" validate:"required,email"`
		Name  string `json:"name" validate:"required"`
		Phone string `json:"phone" validate:"required,e164"`
		// Address      Address  `json:"address"`
	} `json:"billing_info"`
}

type Card struct {
	Id string `json:"id"`

	// Cardholder name
	Name string

	ExpiryMonth int16
	ExpiryYear  int16

	// One of: visa, mastercard, amex
	Brand string

	// One of: credit, debit, prepaid, or unknown
	Type string

	// Unique hash for this card
	Fingerprint string

	// Last 4 digits of the card number
	Last4 string

	// Billing address
	// Address Address `json:"address"`
}

var Validator *validator.Validate = validator.New()

func (card *Card) Validate() error {
	err := Validator.Struct(card)
	return err
}
