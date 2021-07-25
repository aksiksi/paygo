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

	// Type of payment method: card, bank, or edinar
	Card   *Card `json:"card,omitempty" validate:"required_without_all=Id Bank Edinar"`
	Bank   *Card `json:"bank,omitempty" validate:"required_without_all=Id Card Edinar"`
	Edinar *Card `json:"edinar,omitempty" validate:"required_without_all=Id Card Bank"`

	// Billing information
	BillingInfo struct {
		Email   string   `json:"email" validate:"required,email"`
		Name    string   `json:"name" validate:"required"`
		Phone   string   `json:"phone" validate:"omitempty,e164"`
		Address *Address `json:"address" validate:"-"`
	} `json:"billing_info" validate:"required_without=Id"`
}

func (p *PaymentMethod) Validate() error {
	if err := lib.Validator.Struct(p); err != nil {
		return err
	}

	if p.BillingInfo.Address != nil {
		if err := p.BillingInfo.Address.Validate(); err != nil {
			return err
		}
	}

	return nil
}

func (p *PaymentMethod) ToJson(w io.Writer) error {
	enc := json.NewEncoder(w)
	return enc.Encode(p)
}

func NewPaymentMethodFromJson(r io.Reader) (*PaymentMethod, error) {
	decoder := json.NewDecoder(r)
	p := PaymentMethod{}

	if err := decoder.Decode(&p); err != nil {
		return nil, errors.Errorf("Invalid PaymentMethod JSON: %w", err)
	}

	if err := p.Validate(); err != nil {
		return nil, err
	}

	return &p, nil
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

	Type string `json:"type" validate:"required,oneof=credit debit prepaid unknown"`

	// Cardholder name
	Name string `json:"name" validate:"required"`

	ExpiryMonth int16 `json:"expiry_month" validate:"required,gte=1,lte=12"`
	ExpiryYear  int16 `json:"expiry_year" validate:"required,gte=2021,lte=9999"`

	Brand string `json:"brand" validate:"required,oneof=visa mastercard amex"`

	// Billing address
	BillingAddress Address `json:"billing_address" validate:"required"`

	// Unique hash for this card
	Fingerprint string `json:"fingerprint"`

	EncryptedCard *EncryptedCard `json:"encrypted_card,omitempty" validate:"required,structonly"`

	// Last 4 digits of the card number
	Last4 string `json:"last4"`
}

func (c *Card) Validate() error {
	return lib.Validator.Struct(c)
}
