import { useState } from "react"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="text-mint-500">{count}</div>
      <button onClick={() => setCount(count + 1)}>+</button>
    </>
  )
}

export default App
