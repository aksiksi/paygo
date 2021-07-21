# NOTES

## Overview

`paygo` is a "fake" payment processor service (think: Stripe). This service processes payment requests coming from third-party applications.

Here is the overall flow of operations:

1. User hits "purchase" on a third-party website
2. Third-party app redirects the user to the `paygo` frontend (single-page app (?))
3. User enters payment info
4. `paygo` frontend app forwards the request to this service
5. Once this service processes the payment, it returns the result and payment ID to the frontend
6. The frontend informs the user of the result
7. Frontend redirects the user back to the third-party app

![Paygo Architecture Diagram](paygo_architecture.svg)

## Services

`paygo` consists of 2 external and 4 internal services. All internal services talk to each other via gRPC.

* External
  * checkout: Handles requests to checkout from our frontend
    * Third-party websites are redirected to our frontend
  * refund: Handles refund requests issued by third-party apps
* Internal
  * auth: Authenticates external requests and verifies quotas, billing, etc.
  * card: CRUD API for Cards - add/update/remove credit cards from the DB
    * Returns a unique Card ID to the caller
  * charge: Initiates a Charge for some amount on the given Card
    * Returns a unique Charge ID to the caller
  * transaction: Performs the final transaction via the bank's interface

### Checkout

To start off with, the `checkout` service will be a "monolith" that encapsulates all other services. The plan is to then split these out as needed.

### Charge

A Charge represents a general payment from a user. There are two ways to use a Charge:

1. Standalone: the Charge requires a Payment and a Card to be processed
2. Complete: the Charge includes a Card and a Payment internally, and will the charge will be completed atomically

Type (1) is useful when you want to allow users to store their card(s) for future use OR when you want to present the user with a "review and confirm" page - having the Payment accepted is a good signal that the charge will go through. Note that the Payment the charge points to will be *consumed* in the process.

Type (2) can be used in all other cases - e.g., when card info must not be saved.

```go
type Charge struct {
  // Unique ID for this charge (output)
  Id             string        `json:"id"`

  // Payment to process - either the Id OR remaining fields must
  // be set
  Payment        Payment       `json:"payment"`

  // PaymentMethod to charge - either the Id OR remaining fields must
  // be set
  PaymentMethod  PaymentMethod `json:"payment_method"`

  // Subscription information (ignored if Active == false)
  Subscription   struct {
    Active bool                `json:"active"`
    Interval time.Duration     `json:"interval"`
  } `json:"subscription"`

  Refunded       bool          `json:"refunded"`
  Success        bool          `json:"success"`
  CompletionTime int64         `json:"completion_time"`
  ErrorMessage   string        `json:"error_message"`
}
```

#### API

* POST `/v1/checkout`: start a new Checkout
  * Input: `Charge`
  * Output: `Charge` -> ID, success, and error message will be populated
* GET `/v1/checkout/{id}`: get info for a previous Checkout

### Payment

A Payment represents an amount to be charged.

Taken alone, a Payment does not reflect any financial action: it only represents a payment to be charged (Charge) to a card some time in the future. A Payment can be converted into a Charge using the Charge API. Note that the Payment will be *consumed* in the process.

This is useful for custom checkout flows.

```go
type Payment struct {
  // Unique ID for this payment
  Id             string   `json:"id"`

  // Amount, in minimum unit for the currency
  Amount         int64    `json:"amount"`

  // Currency (3 letter ISO code)
  Currency       string   `json:"currency"`

  Completed      bool     `json:"currency"`

  ChargeId       string   `json:"charge_id"`

  // Optional description for this charge
  Description    string   `json:"description"`
}
```

### PaymentMethod and Card

```go
type PaymentMethod struct {
  Id      string    `json:"id"`

  // Type of payment method: bank, card, or edinar
  Type    string    `json:"type"`
  Card    *Card     `json:"card, omitempty"`
  Bank    *Bank     `json:"bank, omitempty"`
  Edinar  *Edinar   `json:"edinar, omitempty"`

  // Billing information
  BillingInfo    struct {
    Email        string   `json:"email"`
    Name         string   `json:"name"`
    Phone        string   `json:"phone"`
    Address      Address  `json:"address"`
  } `json:"billing_info"`
}
```

```go
type Card struct {
  Id          string    `json:"id"`

  // Cardholder name
  Name        string

  ExpiryMonth int16
  ExpiryYear  int16

  // One of: visa, mastercard, amex
  Brand       string

  // One of: credit, debit, prepaid, or unknown
  Type        string

  // Unique hash for this card
  Fingerprint string

  // Last 4 digits of the card number
  Last4       string

  // Billing address
  Address     Address  `json:"address"`
}
```

### Refund

TBD

### Auth

### Transaction

### Resources

* https://eli.thegreenplace.net/2021/rest-servers-in-go-part-1-standard-library/
* https://www.alexedwards.net/blog/how-to-properly-parse-a-json-request-body

## Types

### `Payment`

The basic unit of input is a `Payment`. Each `Payment` contains the information required to handle a card payment:

* `Application`: the third-party application requesting this payment
  * ID
  * Secret
* `PaymentMethod`: card, bank account, etc.
* Amount (integer)
* Notes (optional)

### `PaymentMethod`

* `Type`: card or bank
* `Card`: the payment method info (taken from user of third-party app)
  * Card number
  * Expiry date
  * CVV
  * Verification state
* `Bank`: TODO
* Billing info
  * Name
  * Address (?)
  * Country

### `Subscription`

Extends a payment with info on how often to charge the card and for how long.

* `Application`: the third-party application requesting this payment
    * ID
    * Secret
* `Payment`: same as above
* `Frequency`: daily, monthly, yearly
* `Count`: count or -1 (forever)
* `Start`: time at which to make the first charge

## Basic Architecture

The service exposes a REST API backend to
