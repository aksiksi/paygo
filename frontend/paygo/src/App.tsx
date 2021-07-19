import "./App.css"
import "./index.css"

import Checkout from "./components/Checkout"

import StoreLogo from "./images/merchant-logo.png"
import ProductImage from "./images/product-image.jpg"

function App() {
  return (
    <Checkout
      storeName="Ultimate Shoe Store"
      storeLogoUrl={StoreLogo}
      productName="The Shoe"
      productPrice="$20.00"
      productImageUrl={ProductImage}
    />
  )
}

export default App;
