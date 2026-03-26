import { useState } from 'react'
 
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   <div className='text-2xl text-green-700 font-bold h-screen flex items-center justify-center'>AI POWERED RESUME ANALYSER</div>
    </>
  )
}

export default App
