# NOTES

## Overview

`paygo` is a "fake" payment processor backend service (think: Stripe backend). This service process payment requests coming from third-party applications.

This is an internal service. In other words, third-party apps do not talk to this service directly. The overall flow looks like this:

1. User hits "purchase" on third-party website
2. Third-party app redirects the user to our frontend
3. User enters payment info
4. Frontend app forwards the payment to this service
5. Once this service processes the payment, it returns the result and payment ID to the frontend
6. The frontend informs the user of the result
7. Frontend redirects the user to the third-party app

## API Endpoints

* `/v1/checkout`
  * POST: Initiate a payment
    * Returns: payment ID
* `/v1/payment`
  * POST: Perform a payment
  * GET: `/v1/payment/[id]`
  * Notes:
    * No other methods allowed: payments are immutable
    * Any changes need to take the form of a new payment
* `/v1/subscription`
  * POST: Start a recurring payment
  * GET: `/v1/subscription/[id]`

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
