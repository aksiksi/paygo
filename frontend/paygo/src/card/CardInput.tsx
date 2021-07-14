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

function getCardType(validityInfo: CardNumberVerification): CardType {
    let cardType

    if (!validityInfo.isPotentiallyValid && !validityInfo.isValid) {
        return CardType.Invalid
    } else if (!validityInfo.card) {
        return CardType.Unknown
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
            cardType = CardType.Invalid
            break
    }

    return cardType
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
            let cardType = getCardType(validity)

            return { cardType }
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
        let inputClass: string;

        // Highlight the credit card input based on detected type/validity
        if (this.state.cardType == CardType.Unknown) {
            inputClass = "mt-1 block pl-14 w-full border border-gray-300 rounded-lg shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        } else if (this.state.cardType == CardType.Invalid) {
            inputClass = "mt-1 block pl-14 w-full border border-red-300 rounded-lg shadow-sm focus:border-red-300 focus:ring-red-300"
        } else {
            inputClass = "mt-1 block pl-14 w-full border border-green-300 rounded-lg shadow-sm focus:border-green-300 focus:ring-green-300"
        }

        return (
            <label className="block relative">
                {this.renderCardLogo()}
                <input type="text" className={inputClass} onInput={this.onCardNumberChange} />
            </label>
        )
    }
}
