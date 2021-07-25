import "./App.css"
import "./index.css"

import Checkout, { CheckoutProps } from "./components/Checkout"

import StoreLogo from "./images/merchant-logo.png"
import ProductImage from "./images/product-image.jpg"

const checkoutParams: CheckoutProps = (window as any).__CHECKOUT_PARAMS

function App() {
  return (
    <Checkout
      {...checkoutParams}
      storeLogoUrl={StoreLogo}
      productImageUrl={ProductImage}
    />
  )
}

export default App;
