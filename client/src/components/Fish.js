import '../style/Fish.css'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";

function Fish({ fishes, lakeId, user, setLake }) {

  const navigate = useNavigate()
  const fishArray = Object.values(fishes);
  const [error, setError] = useState('')

  const months = [
    null, 'January', 'February', 
    'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 
    'October', 'November', 'December'
  ];

  function handleApprove(id) {
    const conn = [...fishes].find(fish => {
      return fish.fish_id === id
    })

    fetch(`/lake_fish/${conn.id}`, {
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
          setLake(pre => {
            const updatedFish = pre.lake_fish.map(fish => {
              if (fish.id === conn.id) {
                return data
              } else {
                return fish
              }
            })
            return {...pre, lake_fish: updatedFish}
          })
        })
      } else {
        r.json()
        .then(err => setError(err.error))
      }
    })
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
      } else {
        r.json()
        .then(err => setError(err.error))
      }
    })
    .catch(err => setError('Network Error. Please try again later.'))
  }

  const approvedFish = fishArray.filter(fish => {
    if (fish.fish) {
      return fish.status === 'approved'
    }return null
  })

  const pendingFish = fishArray.filter(fish => {
    if (fish.fish) {
      return fish.status === 'pending'
    } return null
  })

  return (
    <div className='fish-component-container'>
      {approvedFish[0] && <h2 className='fish-h2'>Fish</h2>}
      <div className={approvedFish[0] ? 'fish-list' : 'fish-list-none'}>
        {fishArray && approvedFish.map(fish => {
          if (fish.fish) {
            return <div key={fish.fish.id} className='fish-item'>
              <h2><a href={fish.fish.wiki} target="_blank" rel="noopener noreferrer">{fish.fish.name}</a></h2>
              <h4>Min Length: {fish.fish.min_length !== 0 ? fish.fish.min_length : null}</h4>
              <h4>Max Length: {fish.fish.max_length !== 0 ? fish.fish.max_length : null}</h4>
              <h4>Limit: {fish.fish.daily_limit !== 0 ? fish.fish.daily_limit : null}</h4>
              <h4>Season Start: {months[fish.fish.start_season]}</h4>
              <h4>Season End: {months[fish.fish.end_season]}</h4>
              {fish.fish.image && <img src={fish.fish.image} alt={fish.fish.name}></img>}
            </div>
          }
          return null
        })}
      </div>
      
      {user.Admin && pendingFish[0] && <h2 className='fish-h2'>Pending Fish</h2>}
      <div className={pendingFish[0] ? 'fish-list' : 'fish-list-none'}>
        {user.Admin && 
          pendingFish[0] && pendingFish.map(fish => {
            if (fish.fish) {
              return <div key={fish.fish.id} className='fish-item'>
                <h2><a href={fish.fish.wiki} target="_blank" rel="noopener noreferrer">{fish.fish.name}</a></h2>
                <h4>Min Length: {fish.fish.min_length !== 0 ? fish.fish.min_length : null}</h4>
                <h4>Max Length: {fish.fish.max_length !== 0 ? fish.fish.max_length : null}</h4>
                <h4>Limit: {fish.fish.daily_limit !== 0 ? fish.fish.daily_limit : null}</h4>
                <h4>Season Start: {months[fish.fish.start_season]}</h4>
                <h4>Season End: {months[fish.fish.end_season]}</h4>
                <img src={fish.fish.image} alt={fish.fish.name}></img>
                <div className='pending-buttons'>
                  <button onClick={() => handleApprove(fish.fish.id)}>Approve</button>
                  <button onClick={() => handleDelete(fish.fish.id)}>Delete</button>
                </div>
              </div>
            }
            return null
          })
        }
      </div>
      
      {error && <h2>{error}</h2>}
      {user.id && <button onClick={() => navigate(`/new/fish/${lakeId}`)}>Add Fish</button>}
    </div>
  )
}

export default Fish