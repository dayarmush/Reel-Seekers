import Login from './Login'
import { useEffect, useState } from 'react'
import LakeCard from './LakeCard'
import { useNavigate } from 'react-router-dom'

function LoginPage({ user, setUser, lakes }) {

  const navigate = useNavigate()

  const [pendingLakes, setPendingLakes] = useState([])
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

  const handleApprove = (id) => {
    fetch(`/lakes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'approved'
      })
    })
    .then(r => {
      if (r.ok) {
        r.json()
        .then(data => {
          setPendingLakes(pre => {
            pre.filter(lake => lake.id !== data.id)
          })
        })
      } else {
        r.json()
        .then(err => setError(err.error))
      }
    })
  }

  useEffect(() => {
    setPendingLakes(lakes.filter(lake => {
      return lake.status === 'pending'
    }).map(lake => { 
      return <LakeCard key={lake.id} lake={lake} handleApprove={handleApprove}/>
    }))
  }, [lakes, setPendingLakes])

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
          <p>To Contribute:
            <button onClick={() => navigate('/new/lake')}>Add Lake</button>
          </p>
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
      {user.Admin && 
        <div>
          <h1>Pending Lakes:</h1>
          {pendingLakes}
        </div>
      }
      {error && <h2>{error}</h2>}
    </div>
    
  )
}

export default LoginPage