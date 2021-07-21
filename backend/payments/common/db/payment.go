package db

import (
	"github.com/aksiksi/paygo/payments/common/data"
	"github.com/pkg/errors"
)

var paymentDb = []*data.Payment{
	{
		Id:     "abcd",
		Amount: 1000,
	},
}

func GetPayment(id string) (*data.Payment, error) {
	for _, payment := range paymentDb {
		if payment.Id == id {
			return payment, nil
		}
	}

	return nil, errors.Errorf("Payment(id=%s) not found", id)
}

func SavePayment(payment *data.Payment) error {
	paymentDb = append(paymentDb, payment)
	return nil
}
