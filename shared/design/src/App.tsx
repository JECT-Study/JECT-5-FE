import { useState } from "react"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex-1 text-red-100">{count}</div>
      <button onClick={() => setCount(count + 1)}>+</button>
    </>
  )
}

export default App
