package api

import (
	"encoding/json"
	"fmt"
	"io"

	"github.com/aksiksi/paygo/checkout/lib"
	"github.com/pkg/errors"
)

type PaymentMethod struct {
	Id string `json:"id"`

	// Type of payment method: bank, card, or edinar
	Type string `json:"type" validate:"required"`
	Card *Card  `json:"card,omitempty"`
	//   Bank    *Bank     `json:"bank, omitempty"`
	//   Edinar  *Edinar   `json:"edinar, omitempty"`

	// Billing information
	BillingInfo struct {
		Email   string  `json:"email" validate:"required,email"`
		Name    string  `json:"name" validate:"required"`
		Phone   string  `json:"phone" validate:"required,e164"`
		Address Address `json:"address"`
	} `json:"billing_info"`
}

type invalidAddress struct {
	msg string
}

func (e *invalidAddress) Error() string {
	return fmt.Sprintf("invalid address: %s", e.msg)
}

type Address struct {
	Street1    string `json:"street1" validate:"required"`
	Street2    string `json:"street2"`
	City       string `json:"city" validate:"required"`
	State      string `json:"state"`
	PostalCode string `json:"postal_code" validate:"required"`
	Country    string `json:"country" validate:"required,iso3166_1_alpha3"`
}

func (a *Address) Validate() error {
	err := lib.Validator.Struct(a)
	if err != nil {
		return err
	}

	if a.Country == "USA" && a.State == "" {
		return &invalidAddress{msg: "state must be set for USA"}
	}

	return nil
}

type EncryptedCard struct {
	Key  string `json:"key" validate:"required"`
	Data []byte `json:"data" validate:"required"`
}

type Card struct {
	Id string `json:"id"`

	// Cardholder name
	Name string `json:"name"`

	ExpiryMonth int16 `json:"expiry_month"`
	ExpiryYear  int16 `json:"expiry_year"`

	// One of: visa, mastercard, amex
	Brand string `json:"brand"`

	// One of: credit, debit, prepaid, or unknown
	Type string `json:"type"`

	// Billing address
	Address Address `json:"address" validate:"required"`

	// Unique hash for this card
	Fingerprint string `json:"fingerprint"`

	EncryptedCard *EncryptedCard `json:"encrypted_card"`

	// Last 4 digits of the card number
	Last4 string `json:"last4"`
}

func (card *Card) Validate() error {
	var err error

	err = lib.Validator.Struct(card)
	if err != nil {
		return errors.Errorf("invalid card: %w", err)
	}

	err = card.Address.Validate()
	if err != nil {
		return err
	}

	return nil
}

func (c *Card) ToJson(w io.Writer) error {
	enc := json.NewEncoder(w)
	return enc.Encode(c)
}

func NewCardFromJson(r io.Reader) (*Card, error) {
	decoder := json.NewDecoder(r)
	card := Card{}

	err := decoder.Decode(&card)
	if err != nil {
		return nil, errors.Errorf("invalid card JSON: %w", err)
	}

	err = card.Validate()
	if err != nil {
		// TODO: Return a specific error type
		return nil, errors.Errorf("invalid card: %w", err)
	}

	return &card, nil
}
