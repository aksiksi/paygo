import React from "react"
import CardForm, { CardFormData } from "./CardForm"

function MerchantLogo(props: {storeName: string, storeLogo?: string}) {
  return (
    <div className="flex items-center">
      { props.storeLogo && <img className="w-4 h-4 mr-1" src={props.storeLogo} alt={`${props.storeName} logo`} /> }
      <span>{ props.storeName }</span>
    </div>
  )
}

function CheckoutInfoHeader(props: {storeName: string, storeLogo?: string}) {
  const [isHover, setIsHover] = React.useState(false)

  // TODO: Can we implement hover in CSS?
  //
  // Otherwise, ue need to modify hover behavior on mobile by checking current Tailwind
  // breakpoint (see: https://stackoverflow.com/a/59982143/845275).
  return (
    <a
      href="/"
      className="w-48 mt-1 lg:-ml-8 flex items-center text-sm py-1 px-2"
      onMouseOver={ (_: any) => setIsHover(true) }
      onMouseOut={ (_: any) => setIsHover(false) }
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>

      <div className="flex-shrink-0">
        { isHover
          ? <div>Back</div>
          : <MerchantLogo {...props} />
        }
      </div>
    </a>
  )
}

function CheckoutInfoContent(props: {storeName: string, productPrice: string, productName: string, productImageUrl?: string}) {
  return (
    <div className="flex flex-col space-y-4 justify-center lg:justify-start">
      <div>
        <h1 className="text-gray-900 text-lg text-opacity-75 text-center lg:text-left">{props.productName}</h1>
        <p className="text-3xl font-bold text-center lg:text-left">{props.productPrice}</p>
      </div>
      <div className="text-gray-900 text-center lg:text-left">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus nibh a ante dictum convallis. Nunc vel vulputate mi, ac tempor metus.</p>
      </div>
      <div>
        <img src={props.productImageUrl} alt="Shoe product" className="mx-auto lg:mx-0 h-64 object-scale-down"/>
      </div>
    </div>
  )
}

function CheckoutFooter() {
  return (
    <div className="absolute bottom-0 left-0 mb-2">
      <span className="text-sm">Powered by <span className="font-semibold">PayGo</span></span>
    </div>
  )
}

export class CheckoutProps {
  clientId: string = "TBD"
  storeName: string = "Unknown"
  productName: string = "TBA"
  productPrice: string = "$xx.xx"
  storeLogoUrl?: string
  productImageUrl?: string
}

class Checkout extends React.Component<CheckoutProps, any> {
  async onCardReady(data: CardFormData): Promise<string | null> {
    // TODO: Perform API request(s) here
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(null)
      }, 2000)
    });
  }

  render() {
    return (
      <div className="flex flex-col h-screen items-center justify-start lg:justify-center">
        <div className="checkout-container">
          <div className="checkout-info">
            <div className="flex-initial flex-col space-y-6 justify-center xs:w-96">
              <CheckoutInfoHeader storeName={this.props.storeName} storeLogo={this.props.storeLogoUrl} />
              <CheckoutInfoContent {...this.props} />
            </div>
          </div>

          <div className="checkout-form">
            <div className="flex-initial lg:flex-col justify-center xs:w-96">
              <CardForm onCardReady={this.onCardReady} />
            </div>
          </div>

          <CheckoutFooter />

        </div>
      </div>
    )
  }
}

export default Checkout
