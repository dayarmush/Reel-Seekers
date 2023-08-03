import '../style/LakeCard.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'

function LakeCard({ lake, setLakes }) {

  const [error, setError] = useState('')

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
          setLakes(pre => {
            return pre.map(lake => {
              if (lake.id === id) {
                return data
              } else {
                return lake
              }
            })
          })
        })
      } else {
        r.json()
        .then(err => setError(err.error))
      }
    })
  }

  const handleDelete = (id) => {
    fetch(`/lakes/${id}`, {
      method: 'DELETE'
    })
    .then(r => {
      if (r.ok) {
        setLakes(pre => {
          return pre.filter(lake => lake.id !== id)
        })
      } else {
        r.json()
        .then(err => setError(err.error))
      }
    })
  }

  return (
    <div >
      <Link to={`/lake/${lake.id}`}>
        <h2>{lake.name}</h2>
        <h3>{lake.state}</h3>
      </Link>
      {lake.status === 'pending' && 
        <div>
          <button onClick={() => handleApprove(lake.id)}>Approve</button>
          <button onClick={() => handleDelete(lake.id)}>Delete</button>
        </div> 
      }
      {error && <p>{error}</p>}
    </div>
  )
}

export default LakeCard