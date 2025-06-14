import "./App.css"

import { useState } from "react"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>+</button>
    </>
  )
}

export default App
