import './App.css'
import './index.css'

import { CardForm } from "./CardForm"

function App() {
  return (
    <div className="max-w-xl mx-auto py-12 divide-y md:max-w-4xl">
      <div className="py-12">
        <h2 className="text-2xl">Form</h2>
        <CardForm />
      </div>
    </div>
  );
}

export default App;
