import React, { FormEvent, useState } from "react"
import { creditCardType } from "card-validator"
import { cardNumber as cardNumberValidator, CardNumberVerification } from "card-validator/dist/card-number"
import { FormState, useForm, UseFormRegister } from "react-hook-form"

import { ReactComponent as VisaLogo } from './svgs/visa.svg'
import { ReactComponent as MastercardLogo } from './svgs/mastercard.svg'
import { ReactComponent as AmexLogo } from './svgs/amex.svg'
import { ReactComponent as DiscoverLogo } from './svgs/discover.svg'
import { ReactComponent as GenericCardLogo } from './svgs/generic.svg'

import "../index.css"

// Expose the card type strings
const { types: cardTypeStrings } = creditCardType

export enum CardType {
    Visa,
    Mastercard,
    Amex,
    Discover,
    Other,
    Unknown,
    Invalid,
}

/**
 * Renders the CVV input with the correct size based on the current card type.
 *
 * @returns The input element for the CVV.
 */
function CvvInput(props: {
    cardType: CardType,
    className?: string
    register: UseFormRegister<CardFormFields>,
}) {
    let maxLength = 3, codeName = "CVV"

    if (props.cardType === CardType.Amex) {
        maxLength = 4
        codeName = "CID"
    }

    return <input
        placeholder={codeName}
        maxLength={maxLength}
        className={props.className}
        type="text"
        id="creditCardCvv"
        {...props.register("creditCardCvv", { required: true })}
    />
}

/**
 * Renders the appropriate card logo to the left of the card number input based on
 * the current detected card type.
 *
 * @returns The SVG element for the card logo.
 */
function CardLogo(props: {cardType: CardType}) {
    const className = "absolute right-3 pointer-events-none w-8 h-8 top-1/2 transform -translate-y-1/2"

    switch (props.cardType) {
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

/**
 * Renders the credit card + CVV + expiry date form inputs.
 *
 * @returns JSX element for the credit card information.
 */
function CardInput(
    props: {
        cardType: CardType,
        cardIsValid?: boolean,
        register: UseFormRegister<CardFormFields>,
        formState: FormState<CardFormFields>,
        onCardNumberChange: (_: FormEvent) => void
    }) {
    // Default input border is gray
    let border: string = "border border-gray-300 focus:border-yellow-500 focus:ring-yellow-500" 

    // Highlight the credit card input based on detected type and validity
    // if (props.cardIsValid && props.cardType !== CardType.Other) {
    //     border = "border-2 border-green-300 focus:border-green-300 focus:ring-green-300"
    // } else if (!props.cardIsValid && props.cardType === CardType.Invalid) {
    //     border = "border-2 border-red-300 focus:border-red-300 focus:ring-red-300"
    // }

    return (
        <div>
            <div>
                <label>Credit card</label>
                <span className="block relative">
                    <CardLogo cardType={props.cardType} />
                    <input
                        type="text"
                        placeholder="4111 1111 1111 1111"
                        className={`mt-1 block pr-12 w-full rounded-sm rounded-t-lg shadow-sm ${border}`}
                        onInput={props.onCardNumberChange}
                        maxLength={16}
                        {...props.register("creditCardNumber", {
                            required: true,
                            validate: (_: string) => {
                                return props.cardIsValid
                            }
                        })}
                    />
                    { props.formState.errors.creditCardNumber && <span className="text-sm text-red-700">Required</span>}
                </span>
            </div>
            <div className="flex flex-wrap -mx-1">
                <div className="w-1/2 pl-1">
                    <CvvInput
                        cardType={props.cardType}
                        className={"w-full h-10 px-3 text-base rounded-sm rounded-bl-lg placeholder-gray-600 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"}
                        register={props.register}
                    />
                    { props.formState.errors.creditCardCvv && <span className="text-sm text-red-700">Required</span>}
                </div>
                <div className="w-1/2 pr-1">
                    <input placeholder="MM/YY" className="w-full h-10 px-3 text-base rounded-sm rounded-br-lg placeholder-gray-600 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500" type="text" id="creditCardExpiry" />
                </div>
            </div>
        </div>
    )
}

class CardFormState {
    cardType: CardType = CardType.Unknown
    cardIsValid?: boolean
}

/**
 * Whenever the card number input changes, update the internal card type state.
 *
 * @param event The input event for the card number field
 */
function onCardNumberChange(event: FormEvent, setState: any) {
    setState((_: CardFormState) => {
        let elem = event.target as HTMLInputElement
        let cardNumber: string = elem.value

        let validity: CardNumberVerification = cardNumberValidator(cardNumber)

        return getCardType(validity)
    })
}

function getCardType(validityInfo: CardNumberVerification): CardFormState {
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

class CardFormFields {
    creditCardNumber: string = ""
    creditCardCvv: string = ""
    creditCardExpiry: string = ""
    creditCardFirstName: string = ""
    creditCardLastName: string = ""
}

export function CardForm() {
    const [state, setState] = useState(new CardFormState())

    const { register, handleSubmit, formState } = useForm({ defaultValues: new CardFormFields() })

    const onSubmit = (data: any) => console.log(data)

    return (
        <div className="w-96 m-auto">
            <form className="w-full space-y-2 text-gray-700">
                <CardInput {...state} register={register} formState={formState} onCardNumberChange={(event: FormEvent) => onCardNumberChange(event, setState)} />

                <div className="flex flex-wrap -mx-1 space-y-3 md:space-y-0">
                    <div className="w-full px-1 md:w-1/2">
                        <label className="block mb-1" htmlFor="creditCardFirstName">First name</label>
                        <input className="w-full h-10 px-3 text-base rounded-lg placeholder-gray-600 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500" type="text" id="creditCardFirstName" />
                    </div>
                    <div className="w-full px-1 md:w-1/2">
                        <label className="block mb-1" htmlFor="creditCardLastName">Last name</label>
                        <input className="w-full h-10 px-3 text-base rounded-lg placeholder-gray-600 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500" type="text" id="creditCardLastName" />
                    </div>
                </div>

                <div>
                    <button className="mt-3 w-full py-2 px-4 rounded-md justify-center bg-yellow-500 text-white" type="submit" onClick={handleSubmit(onSubmit)}>Submit</button>
                </div>
            </form>
        </div>
    )
}
