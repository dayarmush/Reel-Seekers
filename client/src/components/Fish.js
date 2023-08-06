import { useState } from 'react'
import { useNavigate } from "react-router-dom";

// filter for pending and approved
// only admin can see the pending

function Fish({ fishes, lakeId, user, setLake }) {

  const navigate = useNavigate()
  const fishArray = Object.values(fishes);
  const [error, setError] = useState('')

  function handleApprove(id) {
    console.log(id)
  }

  function handleDelete(id) {
    fetch(`/fish/${id}`, {
      method: 'DELETE',
    })
    .then(r => {
      if (r.ok) {
        // setLake(pre => {
        //   const fish = pre.lake_fish.filter(fish => {
        //     return fish.fish.id !== id
        //   })
        //   return {...pre, lake_fish: fish}
        // })
        console.log('ok')
      } else {
        r.json()
        .then(err => setError(err.error))
      }
    })
  }

  const approvedFish = fishArray.filter(fish => {
    if (fish.fish) {
      return fish.fish.status === 'approved'
    }
  })

  const pendingFish = fishArray.filter(fish => {
    if (fish.fish) {
      return fish.fish.status === 'pending'
    }
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
        })
      }
      {user.id && <button onClick={() => navigate(`/new/fish/${lakeId}`)}>Add Fish</button>}
    </div>
  )
}

export default Fish