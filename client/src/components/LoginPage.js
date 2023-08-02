import Login from './Login'
import { useNavigate } from 'react-router-dom'

function LoginPage({ user, setUser }) {

  const navigate = useNavigate()

  return (
    <div>
      {!user.username && 
        <div>
          <Login setUser={setUser}/>
          <p>
            Don't Have an Account?
            <button onClick={() => navigate('/new/user')}>Signup</button>
          </p>
        </div>
      }
      {user.id && <h2>Welcome: {user.username}</h2>}
    </div>
    
  )
}

export default LoginPage