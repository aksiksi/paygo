import { FormEvent, useState } from "react"
import { creditCardType } from "card-validator"
import { cardNumber as cardNumberValidator, CardNumberVerification } from "card-validator/dist/card-number"
import Joi, { CustomHelpers } from "joi"

import { ReactComponent as VisaLogo } from "../svgs/cards/visa.svg"
import { ReactComponent as MastercardLogo } from "../svgs/cards/mastercard.svg"
import { ReactComponent as AmexLogo } from "../svgs/cards/amex.svg"
import { ReactComponent as DiscoverLogo } from "../svgs/cards/discover.svg"
import { ReactComponent as GenericCardLogo } from "../svgs/cards/generic.svg"

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
function useCvvInput(cardType: CardType, setCardFormState: any): any {
    // Determine the max input length and card code name
    let maxLength = 3, codeName = "CVV"
    if (cardType === CardType.Amex) {
        maxLength = 4
        codeName = "CID"
    }

    function onChange(event: FormEvent) {
        const elem = event.target as HTMLInputElement

        setCardFormState((state: CardFormState) => {
            return {
                ...state,
                formData: {
                    ...state.formData,
                    creditCardCvv: elem.value,
                }
            }
        })
    }

    return {
        onChange,
        maxLength,
        placeholder: codeName,
    }
}

function formatExpiryDate(expiryDate: string): string {
    const strippedDate = expiryDate.replace(/\D+/, "")

    if (strippedDate.length >= 3) {
        return `${strippedDate.substr(0, 2)} / ${strippedDate.substr(2)}`
    }

    return strippedDate
}

function useExpiryInput(setCardFormState: any): any {
    function onChange(event: FormEvent) {
        const elem = event.target as HTMLInputElement

        setCardFormState((state: CardFormState) => {
            return {
                ...state,
                formData: {
                    ...state.formData,
                    creditCardExpiry: elem.value,
                }
            }
        })
    }

    return {
        placeholder: "MM / YY",
        maxLength: 7, // MM / YY
        onChange,
    }
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

function getCardInfo(validityInfo: CardNumberVerification): { cardType: CardType, isCardValid: boolean } {
    if (!validityInfo.isPotentiallyValid && !validityInfo.isValid) {
        return { cardType: CardType.Invalid, isCardValid: false }
    } else if (!validityInfo.card) {
        return { cardType: CardType.Unknown, isCardValid: false }
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

    return { cardType, isCardValid: validityInfo.isValid }
}

/**
 * Hacky way to insert spaces into a card number
 *
 * @param cardNumber Credit card number (without spaces)
 * @returns New credit card number with spaces inserted after every 4th digit
 */
function formatCardNumber(cardNumber: string): string {
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

type CardFormDataFields = "creditCardNumber" | "creditCardCvv" | "creditCardExpiry" | "creditCardFirstName" | "creditCardLastName"

class CardFormData {
    creditCardNumber: string = ""
    creditCardCvv: string = ""
    creditCardExpiry: string = ""
    creditCardFirstName: string = ""
    creditCardLastName: string = ""
}

class CardFormState {
    // Form state
    cardType: CardType = CardType.Unknown

    // Form information
    formData: CardFormData = new CardFormData()
    formErrors: string[] = []
}

/**
 * Renders the credit card + CVV + expiry date form inputs.
 *
 * @returns JSX properties for the credit card field.
 */
function useCardInput(setCardFormState: any) {
    /**
     * Whenever the card number input changes, update the internal card type state.
     *
     * @param event The input event for the card number field
     */
    function onChange(event: FormEvent) {
        setCardFormState((state: CardFormState) => {
            let elem = event.target as HTMLInputElement
            let cardNumber: string = elem.value.replaceAll(" ", "")

            let validity: CardNumberVerification = cardNumberValidator(cardNumber)
            const {cardType} = getCardInfo(validity)

            return {
                ...state,
                cardType,
                formData: {
                    ...state.formData,
                    creditCardNumber: cardNumber,
                }
            }
        })
    }

    return {
        onChange,
        // TODO(aksiksi): This might need to be upto 23 - 19 + 3
        maxLength: 19, // 16 digits + 3 spaces
    }
}

// Custom Joi validator for a credit card number
function validateCardNumber(value: string, helpers: CustomHelpers<any>) {
    const { isCardValid } = getCardInfo(cardNumberValidator(value))
    return isCardValid ? value : helpers.error("any.invalid")
}

// Schema for the form fields
const cardFormSchema = Joi.object({
    creditCardNumber: Joi.string().pattern(/[0-9]{16}/).custom(validateCardNumber).required(),
    creditCardCvv: Joi.string().pattern(/[0-9]{3,4}/).required(),
    creditCardExpiry: Joi.string().pattern(/[0-9]{2}\/[0-9]{2}/).required(),
    creditCardFirstName: Joi.string().required(),
    creditCardLastName: Joi.string().required(),
})

function validationErrorToMessage(error: Joi.ValidationErrorItem): string {
    const mappings: any = {
        "string.pattern.base": {
            "creditCardNumber": "Credit card number must consist of 16 digits",
            "creditCardCvv": "CVV must contain 3 or 4 digits",
            "creditCardExpiry": "Expiry date must be of the form: MM/YY",
        },
        "any.invalid": {
            "creditCardNumber": "Credit card number is invalid",
        },
        "any.required": {
            "creditCardNumber": "Credit card number is required",
            "creditCardCvv": "CVV is required",
            "creditCardExpiry": "Expiry date is required",
            "creditCardFirstName": "First name is required",
            "creditCardLastName": "Last name is required",
        },
        "string.empty": {
            "creditCardNumber": "Credit card number is required",
            "creditCardCvv": "CVV is required",
            "creditCardExpiry": "Expiry date is required",
            "creditCardFirstName": "First name is required",
            "creditCardLastName": "Last name is required",
        }
    }

    return mappings[error.type][error.context!.key!] + "."
}

function CardForm() {
    const [cardFormState, setCardFormState] = useState(new CardFormState())

    // Validate all form fields using the schema above
    function validateForm(_?: FormEvent): boolean {
        const { error } = cardFormSchema.validate(cardFormState.formData)

        setCardFormState((state: CardFormState) => {
            let formErrors: string[] = []
            if (error) {
                formErrors = error.details.map((error: Joi.ValidationErrorItem, ...rest) => {
                    return validationErrorToMessage(error)
                })
            }

            return {
                ...state,
                formErrors,
            }
        })

        return error ? false : true
    }

    function onSubmit(_: any) {
        if (validateForm()) {
            console.log(cardFormState.formData)
        }
    }

    function setFormValue(event: FormEvent, name: CardFormDataFields) {
        const elem = event.target as HTMLInputElement
        setCardFormState((state: CardFormState) => {
            return {
                ...state,
                formData: {
                    ...state.formData,
                    [name]: elem.value
                }
            }
        })
    }

    return (
        <div className="w-96 m-auto">
            <form className="space-y-2 text-gray-700">
                <div>
                    <div>
                        <label>Credit card</label>
                        <span className="block relative">
                            <CardLogo cardType={cardFormState.cardType} />
                            <input
                                type="text"
                                className={`mt-1 block pr-12 w-full rounded-sm rounded-t-lg shadow-sm card-form-input`}
                                value={formatCardNumber(cardFormState.formData.creditCardNumber)}
                                placeholder="4111 1111 1111 1111"
                                required={true}
                                onBlur={validateForm}
                                {...useCardInput(setCardFormState)}
                            />
                        </span>
                    </div>
                    <div className="flex flex-wrap -mx-1">
                        <div className="w-1/2 pl-1">
                            <input
                                type="text"
                                className={`w-full h-10 px-3 text-base rounded-sm rounded-bl-lg placeholder-gray-600 card-form-input`}
                                value={cardFormState.formData.creditCardCvv}
                                required={true}
                                onBlur={validateForm}
                                {...useCvvInput(cardFormState.cardType, setCardFormState)}
                            />
                        </div>
                        <div className="w-1/2 pr-1">
                            <input
                                type="text"
                                className={`w-full h-10 px-3 text-base rounded-sm rounded-br-lg placeholder-gray-600 card-form-input`}
                                id="creditCardExpiry"
                                value={formatExpiryDate(cardFormState.formData.creditCardExpiry)}
                                required={true}
                                onBlur={validateForm}
                                {...useExpiryInput(setCardFormState)}
                                />
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap -mx-1 space-y-3 md:space-y-0">
                    <div className="w-full px-1 md:w-1/2">
                        <label className="block mb-1" htmlFor="creditCardFirstName">First name</label>
                        <input
                            type="text"
                            className="w-full h-10 px-3 text-base rounded-lg card-form-input"
                            id="creditCardFirstName"
                            required={true}
                            onChange={ (event: FormEvent) => setFormValue(event, "creditCardFirstName") }
                            onBlur={validateForm}
                        />
                    </div>
                    <div className="w-full px-1 md:w-1/2">
                        <label className="block mb-1" htmlFor="creditCardLastName">Last name</label>
                        <input
                            type="text"
                            className="w-full h-10 px-3 text-base rounded-lg card-form-input"
                            id="creditCardLastName"
                            required={true}
                            onChange={ (event: FormEvent) => setFormValue(event, "creditCardLastName") }
                            onBlur={validateForm}
                        />
                    </div>
                </div>

                { cardFormState.formErrors && <span className="text-sm text-red-500">{cardFormState.formErrors[0]}</span> }

                <div>
                    <button className="mt-3 w-full py-2 px-4 rounded-md justify-center bg-yellow-500 text-white" type="submit" onClick={onSubmit}>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default CardForm
