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

### Refund

TBD

### Auth


### Card

### Charge

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
