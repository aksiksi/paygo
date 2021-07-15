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
        {...props.register("creditCardCvv", { required: true, pattern: /[0-9]{3,4}/ })}
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

class CardFormState {
    cardNumber: string = ""
    cardType: CardType = CardType.Unknown
    cardIsValid?: boolean
}

function getCardInfo(validityInfo: CardNumberVerification): { cardType: CardType, cardIsValid: boolean } {
    if (!validityInfo.isPotentiallyValid && !validityInfo.isValid) {
        return { cardType: CardType.Invalid, cardIsValid: false }
    } else if (!validityInfo.card) {
        return { cardType: CardType.Unknown, cardIsValid: false }
    }

    let cardType

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

/**
 * Hacky way to insert spaces into a card number
 *
 * @param cardNumber Credit card number (without spaces)
 * @returns New credit card number with spaces inserted after every 4th digit
 */
function addSpacesToCardNumber(cardNumber: string): string {
    let newCardNumber: string = ""

    for (let i = 0; i < cardNumber.length; i++) {
        newCardNumber += cardNumber[i]

        // Insert a space after every 4th digit, except the last one
        if (i < cardNumber.length - 1 && i % 4 === 3) {
            newCardNumber += " "
        }
    }

    return newCardNumber
}

/**
 * Whenever the card number input changes, update the internal card type state.
 * Also, insert spaces in the card number.
 *
 * @param event The input event for the card number field
 */
function onCardNumberChange(event: FormEvent, setState: any) {
    setState((_: CardFormState) => {
        let elem = event.target as HTMLInputElement
        let cardNumber: string = elem.value.replaceAll(" ", "")

        let validity: CardNumberVerification = cardNumberValidator(cardNumber)
        const {cardType, cardIsValid} = getCardInfo(validity)

        return {
            cardNumber,
            cardType,
            cardIsValid,
        }
    })
}

/**
 * Renders the credit card + CVV + expiry date form inputs.
 *
 * @returns JSX element for the credit card information.
 */
function CardInput(
    props: {
        register: UseFormRegister<CardFormFields>,
        formState: FormState<CardFormFields>,
    }) {
    const [cardFormState, setCardFormState] = useState(new CardFormState())

    const { onChange: onChangeOrig, ...registerRest } =
        props.register("creditCardNumber", {
            required: true,
            validate: (_: string) => {
                return cardFormState.cardIsValid
            }
        })

    // Override the onChange handler with some custom logic
    const onChange = (event: FormEvent) => {
        // Trigger the original handler
        onChangeOrig(event)

        // Prevent changes to the card number input from triggering a new event
        event.stopPropagation()

        // Update the card input based on the current state
        onCardNumberChange(event, setCardFormState)
    }

    // Default input border is gray
    let cardBorder = "border border-gray-300 focus:border-yellow-500 focus:ring-yellow-500" 
    let cvvBorder = "border border-gray-300 focus:border-yellow-500 focus:ring-yellow-500" 
    let expiryBorder = "border border-gray-300 focus:border-yellow-500 focus:ring-yellow-500" 

    const cardError = props.formState.errors.creditCardNumber
    const cvvError = props.formState.errors.creditCardCvv
    const expiryError = props.formState.errors.creditCardExpiry

    const errors = []

    if (cardError) {
        if (cardError?.type === "required") {
            errors.push("Card number is required")
        } else if (cardError?.type === "validate") {
            errors.push("Card number is incomplete")
        }
    }

    if (cvvError) {
        if (cvvError?.type === "required") {
            errors.push("CVV is required")
        } else if (cvvError?.type === "pattern") {
            errors.push("CVV must be 3-4 digits")
        }
    }

    if (expiryError) {
        if (expiryError?.type === "required") {
            errors.push("Expiry date is required")
        } else if (expiryError?.type === "pattern") {
            errors.push("Expiry date must be MM/YY")
        }
    }

    return (
        <div>
            <div>
                <label>Credit card</label>
                <span className="block relative">
                    <CardLogo cardType={cardFormState.cardType} />
                    <input
                        type="text"
                        value={addSpacesToCardNumber(cardFormState.cardNumber)}
                        placeholder="4111 1111 1111 1111"
                        className={`mt-1 block pr-12 w-full rounded-sm rounded-t-lg shadow-sm ${cardBorder}`}
                        // TODO(aksiksi): This might need to be upto 23 - 19 + 3
                        maxLength={19} // 16 digits + 3 spaces
                        onChange={onChange}
                        {...registerRest}
                    />
                </span>
            </div>
            <div className="flex flex-wrap -mx-1">
                <div className="w-1/2 pl-1">
                    <CvvInput
                        cardType={cardFormState.cardType}
                        className={`w-full h-10 px-3 text-base rounded-sm rounded-bl-lg placeholder-gray-600 ${cvvBorder}`}
                        register={props.register}
                    />
                </div>
                <div className="w-1/2 pr-1">
                    <input
                        type="text"
                        placeholder="MM/YY"
                        className={`w-full h-10 px-3 text-base rounded-sm rounded-br-lg placeholder-gray-600 ${expiryBorder}`}
                        id="creditCardExpiry"
                        {...props.register("creditCardExpiry", { required: true, pattern: /[0-9]{2}\/[0-9]{2}/})}
                        />
                </div>
            </div>
            { errors && <span className="text-sm text-red-700">{ errors[0] }</span> }
        </div>
    )
}

class CardFormFields {
    creditCardNumber: string = ""
    creditCardCvv: string = ""
    creditCardExpiry: string = ""
    creditCardFirstName: string = ""
    creditCardLastName: string = ""
}

export function CardForm() {
    const { register, handleSubmit, formState } = useForm({ defaultValues: new CardFormFields() })

    const onSubmit = (data: any) => console.log(data)

    return (
        <div className="w-96 m-auto">
            <form className="w-full space-y-2 text-gray-700">
                <CardInput register={register} formState={formState} />

                <div className="flex flex-wrap -mx-1 space-y-3 md:space-y-0">
                    <div className="w-full px-1 md:w-1/2">
                        <label className="block mb-1" htmlFor="creditCardFirstName">First name</label>
                        <input
                            type="text"
                            className="w-full h-10 px-3 text-base rounded-lg placeholder-gray-600 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                            id="creditCardFirstName"
                            {...register("creditCardFirstName", { required: true } ) }
                        />
                        { formState.errors.creditCardFirstName && <span className="text-sm text-red-700">Required</span>}
                    </div>
                    <div className="w-full px-1 md:w-1/2">
                        <label className="block mb-1" htmlFor="creditCardLastName">Last name</label>
                        <input
                            type="text"
                            className="w-full h-10 px-3 text-base rounded-lg placeholder-gray-600 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                            id="creditCardLastName"
                            {...register("creditCardLastName", { required: true } ) }
                        />
                        { formState.errors.creditCardLastName && <span className="text-sm text-red-700">Required</span>}
                    </div>
                </div>

                <div>
                    <button className="mt-3 w-full py-2 px-4 rounded-md justify-center bg-yellow-500 text-white" type="submit" onClick={handleSubmit(onSubmit)}>Submit</button>
                </div>
            </form>
        </div>
    )
}
