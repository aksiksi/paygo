package bank

import "github.com/aksiksi/paygo/common/data"

type Client struct{}

func NewClient() *Client {
	return &Client{}
}

func (client *Client) Payment(payment *data.Payment) error {
	return nil
}
