import React from "react"
import CardForm from "./card/CardForm"

class Checkout extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  render() {
    // TODO: Fix for mobile
    return (
      <div className="flex flex-col lg:flex-row divide-y lg:divide-x lg:divide-y-0 divide-gray-700 h-screen items-center bg-green-300">
        <div className="h-1/3 w-96 lg:w-1/3 lg:h-1/2 py-8 lg:px-16">
          <div>
            <h1 className="text-2xl text-center lg:text-left">Test Store</h1>
          </div>
        </div>
        <div className="h-2/3 w-96 lg:w-2/3 lg:h-1/2 py-8">
          <h1 className="text-2xl text-center">Payment Info</h1>
          <div className="mt-8">
            <CardForm />
          </div>
        </div>
      </div>
    )
  }
}

export default Checkout
