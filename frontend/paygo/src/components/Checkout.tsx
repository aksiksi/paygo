import React from "react"
import CardForm from "./CardForm"

class Checkout extends React.Component<any, any> {
  render() {
    return (
      <div className="checkout-container">
        <div className="checkout-info">
          <div className="flex lg:flex-col justify-center">
            <div className="w-72 sm:w-96 lg:h-96 max-w-md">
              <h1 className="text-2xl text-center lg:text-left">Test Store</h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus nibh a ante dictum convallis. Nunc vel vulputate mi, ac tempor metus. Nunc dolor dolor, facilisis vel dignissim sed, varius vel orci. Vivamus nec dictum sapien. Proin sed malesuada mauris. Donec tempus libero eu tincidunt volutpat. Nunc egestas metus eget lacus viverra mattis. Ut posuere aliquet euismod. Vestibulum tincidunt luctus lacus interdum mattis. Cras consequat pretium lacus eu feugiat. Curabitur vestibulum auctor tempus.</p>
            </div>
          </div>
        </div>

        <div className="checkout-form">
          <div className="flex lg:flex-col justify-center">
            <div className="w-72 sm:w-96 lg:h-96 max-w-lg">
              <h1 className="text-2xl text-center lg:text-left">Payment Info</h1>
              <CardForm />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Checkout
