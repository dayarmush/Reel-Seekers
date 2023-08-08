import '../style/Login.css'
import Login from './Login'
import { useState } from 'react'
import LakeCard from './LakeCard'
import { useNavigate } from 'react-router-dom'

function LoginPage({ user, setUser, lakes, setLakes, setSearchCenter }) {

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

  const pendingLakes = lakes.filter(lake => {
    return lake.status === 'pending'
  }).map(lake => { 
    return <LakeCard key={lake.id} lake={lake} setLakes={setLakes} setSearchCenter={setSearchCenter}/>
  })

  return (
    <div className='user-page-container'>
      {!user.username && 
        <div className='login-container'>
          <Login setUser={setUser}/>
          <p>
            Don't Have an Account?
            <button onClick={() => navigate('/new/user')}>Signup</button>
          </p>
        </div>
      }
      {user.id &&
        <div className='logged-in-container'>
          <h2>Welcome: {user.username}</h2>
          <button onClick={() => navigate('/new/lake')}>Add Lake</button>
          <button onClick={handleLogout} className='sign-out-button'>Sign out</button>
        </div>
      }
      {user.id && 
        <div className='favorite-lake-container'>
          <h3>Favorite Lakes:</h3>
          <div className='favorite-lake-card-container'>
            {user.favorites.map(fave => {
              return <LakeCard key={fave.lake.id} lake={fave.lake}/>
            })}
          </div>
        </div>  
      }

      {user.Admin && 
        <div className='pending-lakes-container'>
          <h1>Pending Lakes:</h1>
          <div className='pending-lakes-card-container'>
            {pendingLakes}
          </div>
        </div>
      }
      {error && <h2>{error}</h2>}
    </div>
  )
}

export default LoginPage