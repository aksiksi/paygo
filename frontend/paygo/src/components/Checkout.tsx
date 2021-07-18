import React from "react"
import CardForm from "./CardForm"

function CheckoutInfoHeader() {
  return (
    <div className="mt-1">
      <button className="text-sm bg-gray-300 hover:bg-white py-1 px-2 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <span>Back</span>
    </div>
  )
}

function CheckoutFooter() {
  return (
    <div className="absolute bottom-0 left-0">
      <span className="text-sm font-semibold">Powered by Paygo</span>
    </div>
  )
}

// TODO: Get the back button placed at top of checkout info flex box
class Checkout extends React.Component<any, any> {
  render() {
    return (
      <div className="flex flex-col h-screen items-center justify-start lg:justify-center">
        <div className="checkout-container">
          <div className="checkout-info">
            <div className="flex-initial flex-col space-y-6 justify-center xs:w-96">
              <CheckoutInfoHeader />
              <div className="flex flex-col space-y-8">
                <div>
                  <h1 className="text-gray-900 text-lg text-opacity-75 text-center lg:text-left">Amazing Shoe Store</h1>
                  <p className="text-3xl font-bold text-center lg:text-left">$20.00</p>
                </div>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus nibh a ante dictum convallis. Nunc vel vulputate mi, ac tempor metus.</p>
              </div>
            </div>
          </div>

          <div className="checkout-form">
            <div className="flex-initial lg:flex-col justify-center xs:w-96">
              <div className="">
                <h1 className="text-2xl text-center lg:text-left">Payment Info</h1>
                <CardForm />
              </div>
            </div>
          </div>

          <CheckoutFooter />

        </div>
      </div>
    )
  }
}

export default Checkout
