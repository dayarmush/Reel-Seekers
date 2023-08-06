import { useState } from 'react'
import { useNavigate } from "react-router-dom";

// filter for pending and approved
// only admin can see the pending
// the pending and approved should be on the lake_fish table
// fix the approved .then()

function Fish({ fishes, lakeId, user, setLake }) {

  const navigate = useNavigate()
  const fishArray = Object.values(fishes);
  const [error, setError] = useState('')

  function handleApprove(id) {
    fetch(`/fish/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'status': 'approved'
      })
    })
    .then(r => {
      if (r.ok) {
        r.json()
        .then(data => {
          setLake(pre => {
            const fish = pre.lake_fish.map(fish => {
              if (fish.fish_id === id) {
                return data.lake_fish
              } else {
                return fish
              }
            })
            console.log(fish)
            return {...pre, lake_fish: fish}
          })
        })
      } else {
        r.json()
        .then(err => setError(err.error))
      }
    })
    .catch(err => setError('Network Error. Please try again later.'))
  }

  function handleDelete(id) {
    const conn = [...fishes].find(fish => {
      return fish.fish_id === id
    })

    fetch(`/lake_fish/${conn.id}`, {
      method: 'DELETE',
    })
    .then(r => {
      if (r.ok) {
        setLake(pre => {
          const fish = pre.lake_fish.filter(fish => {
            return fish.fish_id !== id
          })
          return {...pre, lake_fish: fish}
        })
        console.log('ok')
      } else {
        r.json()
        .then(err => setError(err.error))
      }
    })
    .catch(err => setError('Network Error. Please try again later.'))
  }

  const approvedFish = fishArray.filter(fish => {
    if (fish.fish) {
      return fish.fish.status === 'approved'
    }return null
  })

  const pendingFish = fishArray.filter(fish => {
    if (fish.fish) {
      return fish.fish.status === 'pending'
    } return null
  })

  return (
    <div>
      <h2>Fish:</h2>
      {fishArray && approvedFish.map(fish => {
        if (fish.fish) {
          return <div key={fish.fish.id}>
            <h2>{fish.fish.name}</h2>
            <h4>Min Length: {fish.fish.min_length}</h4>
            <h4>Max Length: {fish.fish.max_length}</h4>
            <h4>Limit: {fish.fish.daily_limit}</h4>
          </div>
        }
        return null
      })}
      {user.Admin && pendingFish[0] && <h2>Pending Fish:</h2>}
      {user.Admin && 
        pendingFish[0] && pendingFish.map(fish => {
          if (fish.fish) {
            return <div key={fish.fish.id}>
              <h2>{fish.fish.name}</h2>
              <h4>Min Length: {fish.fish.min_length}</h4>
              <h4>Max Length: {fish.fish.max_length}</h4>
              <h4>Limit: {fish.fish.daily_limit}</h4>
              <button onClick={() => handleApprove(fish.fish.id)}>Approve</button>
              <button onClick={() => handleDelete(fish.fish.id)}>Delete</button>
            </div>
          }
          return null
        })
      }
      {error && <h2>{error}</h2>}
      {user.id && <button onClick={() => navigate(`/new/fish/${lakeId}`)}>Add Fish</button>}
    </div>
  )
}

export default Fish