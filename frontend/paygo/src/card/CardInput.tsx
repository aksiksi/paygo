import React, { FormEvent } from "react"
import { creditCardType } from "card-validator"
import { cardNumber as cardNumberValidator, CardNumberVerification } from "card-validator/dist/card-number"

import { ReactComponent as VisaLogo } from './svgs/visa.svg'
import { ReactComponent as MastercardLogo } from './svgs/mastercard.svg'
import { ReactComponent as AmexLogo } from './svgs/amex.svg'
import { ReactComponent as DiscoverLogo } from './svgs/discover.svg'
import { ReactComponent as GenericCardLogo } from './svgs/generic.svg'

import "../index.css"

// Expose the card type strings
const { types: cardTypeStrings } = creditCardType

function getCardType(validityInfo: CardNumberVerification): CardInputState {
    let cardType

    if (!validityInfo.isPotentiallyValid && !validityInfo.isValid) {
        return { cardType: CardType.Invalid, cardIsValid: false }
    } else if (!validityInfo.card) {
        return { cardType: CardType.Unknown, cardIsValid: false }
    }

    switch (validityInfo.card.type) {
        case cardTypeStrings.AMERICAN_EXPRESS:
            cardType = CardType.Amex
            break
        case cardTypeStrings.VISA:
            cardType = CardType.Visa
            break
        case cardTypeStrings.MASTERCARD:
            cardType = CardType.Mastercard
            break
        case cardTypeStrings.DISCOVER:
            cardType = CardType.Discover
            break
        default:
            // Unsupported card type
            cardType = CardType.Other
            break
    }

    return { cardType, cardIsValid: validityInfo.isValid }
}

export enum CardType {
    Visa,
    Mastercard,
    Amex,
    Discover,
    Other,
    Unknown,
    Invalid,
}

class CardInputState {
    cardType: CardType = CardType.Unknown
    cardIsValid?: boolean
}

export class CardInput extends React.Component<any, CardInputState> {
    constructor(props: any) {
        super(props)

        this.state = new CardInputState()

        // Event binding
        this.onCardNumberChange = this.onCardNumberChange.bind(this)
    }

    /**
     * Whenever the card number input changes, update the internal card type state.
     *
     * @param event The input event for the card number field
     */
    onCardNumberChange(event: FormEvent) {
        this.setState((_: CardInputState) => {
            let elem = event.target as HTMLInputElement
            let cardNumber: string = elem.value

            let validity: CardNumberVerification = cardNumberValidator(cardNumber)

            return getCardType(validity)
        })
    }

    /**
     * Render the appropriate card logo to the left of the card number input based on
     * the current detected card type.
     *
     * @returns The SVG element for the card logo.
     */
    renderCardLogo() {
        const className: string = "pointer-events-none w-8 h-8 absolute top-1/2 transform -translate-y-1/2 left-3"

        switch (this.state.cardType) {
            case CardType.Visa:
                return <VisaLogo className={className} />
            case CardType.Mastercard:
                return <MastercardLogo className={className} />
            case CardType.Discover:
                return <DiscoverLogo className={className} />
            case CardType.Amex:
                return <AmexLogo className={className} />
            default:
                return <GenericCardLogo className={className} />
        }
    }

    render() {
        // Default border is gray
        let border: string = "border-gray-300 focus:border-yellow-500 focus:ring-yellow-500" 

        // Highlight the credit card input based on detected type and validity
        if (this.state.cardIsValid && this.state.cardType != CardType.Other) {
            border = "border-green-300 focus:border-green-300 focus:ring-green-300"
        } else if (!this.state.cardIsValid && this.state.cardType == CardType.Invalid) {
            border = "border-red-300 focus:border-red-300 focus:ring-red-300"
        }

        const inputClass = `mt-1 block pl-14 w-full rounded-lg shadow-sm ${border}`

        return (
            <label className="block relative">
                {this.renderCardLogo()}
                <input type="text" className={inputClass} onInput={this.onCardNumberChange} />
            </label>
        )
    }
}
