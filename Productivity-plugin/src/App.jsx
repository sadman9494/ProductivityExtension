
//import Login from './components/Login/Login'
import { useState, useEffect } from 'react';
import Popup from './components/popup/Popup.jsx'
import Login from './components/popup/Login/Login.jsx';


function App() {
  const [hasToken , setHasToken] = useState(true) 

  useEffect(() => {
    const checkToken = () => {
      if (localStorage.getItem('token')) {
        setHasToken(true)
      } else {
        setHasToken(false)
      }
    }
    checkToken()
  }, [])
  return (
    <>
      <div>
      {hasToken ? <Popup /> : <Login />}
      </div>
    </>
  )
}

export default App
