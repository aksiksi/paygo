package lib

import (
	"encoding/json"
	"fmt"
	"io"
	"time"
)

type Card struct {
	Number     string
	ExpiryDate time.Time
	Cvv        int
	Name       string
	Address    string
	Country    string
}

type Payment struct {
	Id          string `json:"id"`
	Amount      int    `json:"amount"`
	Description string `json:"description"`
}

func (p *Payment) ToJson(w io.Writer) error {
	enc := json.NewEncoder(w)
	return enc.Encode(p)
}

func PaymentFromJson(r io.Reader) (*Payment, error) {
	payment := &Payment{}

	dec := json.NewDecoder(r)

	err := dec.Decode(payment)
	if err != nil {
		return nil, err
	}

	return payment, nil
}

type PaymentMethodKind int

const (
	PaymentMethodCard PaymentMethodKind = iota
	PaymentMethodBank
)

type PaymentMethod struct {
	Kind PaymentMethodKind
	Card Card
}

func Test() {
	fmt.Println("in test")
}
