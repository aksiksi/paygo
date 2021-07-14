import React from "react"
import "./index.css"

import { CardInput } from './card/CardInput'

class CardFormProps {
}

export class CardForm extends React.Component<CardFormProps, any> {
    constructor(props: CardFormProps) {
        super(props)
    }

    render() {
        return (
            <div className="mt-8">
                <form className="mb-0 space-y-6">
                    <label className="block">
                        <span className="text-gray-700">Email</span>
                        <input className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-yellow-500 focus:ring-yellow-500" type="email"></input>
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Password</span>
                        <input className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-yellow-500 focus:ring-yellow-500" type="password"></input>
                    </label>
                    <CardInput />
                    <div>
                        <button className="mt-1 w-full py-2 px-4 rounded-md flex justify-center bg-yellow-500 text-white" type="submit">Submit</button>
                    </div>
                </form>
            </div>
        )
    }
}
