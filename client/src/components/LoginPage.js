import Login from './Login'
import { useState } from 'react'

function LoginPage() {

  const [user, setUser] = useState([])

  return (
    <div>
      {!user.username && <Login setUser={setUser}/>}
      {user.username && <h2>Welcome: {user.username}</h2>}
    </div>
    
  )
}

export default LoginPage