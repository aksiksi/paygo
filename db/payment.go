package db

import (
	"github.com/aksiksi/paygo/lib"
	"github.com/pkg/errors"
)

var paymentDb = []*lib.Payment{
	&lib.Payment{
		Id:     "abcd",
		Amount: 1000,
	},
}

func GetPayment(id string) (*lib.Payment, error) {
	for _, payment := range paymentDb {
		if payment.Id == id {
			return payment, nil
		}
	}

	return nil, errors.Errorf("Payment(id=%s) not found", id)
}
