import './App.css'
import './index.css'

import { CardForm } from "./CardForm"

function App() {
  return (
    <div class="max-w-xl mx-auto py-12 divide-y md:max-w-4xl">
      <div class="py-12">
        <h2 class="text-2xl">Form</h2>
        <CardForm />
      </div>
    </div>
  );
}

export default App;
