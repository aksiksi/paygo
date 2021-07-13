import React from "react"

import "./index.css"

export class CardForm extends React.Component {
    render() {
        return (
            <div class="mt-8">
                <form class="mb-0 space-y-6">
                    <label class="block">
                        <span class="text-gray-700">Email</span>
                        <input class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-yellow-500 focus:ring-yellow-500" type="email"></input>
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Password</span>
                        <input class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-yellow-500 focus:ring-yellow-500" type="password"></input>
                    </label>
                    <div>
                        <button class="mt-1 w-full py-2 px-4 rounded-md flex justify-center bg-yellow-500 text-white" type="submit">Submit</button>
                    </div>
                </form>
            </div>
        )
    }
}
