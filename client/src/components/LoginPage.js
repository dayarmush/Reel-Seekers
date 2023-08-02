import Login from './Login'
import { useState } from 'react'
import LakeCard from './LakeCard'
import { useNavigate } from 'react-router-dom'

function LoginPage({ user, setUser }) {

  const navigate = useNavigate()
  const [error, setError] = useState('')

  const handleLogout = () => {
    fetch('/logout', {
      method: 'DELETE'
    })
    .then(r => {
      if (r.ok) {
        setUser([])
      } else {
        r.json()
        .then(err => setError(err.error))
      }
    })
  }

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
      {user.id &&
        <div>
          <h2>Welcome: {user.username}</h2>
          <button onClick={handleLogout}>Sign out</button>
        </div>
      }
      {user.id && 
        <div>
          <h2>Favorite Lakes:</h2>
          {user.favorites.map(fave => {
            return <LakeCard key={fave.lake.id} lake={fave.lake}/>
          })}
        </div>
        
      }
      {error && <h2>{error}</h2>}
    </div>
    
  )
}

export default LoginPage