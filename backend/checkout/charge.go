package checkout

import (
	"time"
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
