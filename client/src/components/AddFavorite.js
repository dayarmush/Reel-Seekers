import { useState } from "react"

// stretch goal useContext for setUser
function AddFavorite({ user, lakeId, setUser }) {

  const [error, setError] = useState('')
  let added = []
  let fave

  function handleAdd() {
    if (!user.id) return setError('Please sign in.')
    fetch('/favorites', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        user_id: user.id,
        lake_id: lakeId
      })
    })
    .then(r => {
      if (r.ok) {
        r.json()
        .then(data => {
          setUser(pre => {
            const newFave = [...pre.favorites, data]
            return {...pre, favorites: newFave}
          })
        })
      } else {
        r.json()
        .then(err => setError(err))
      }
    })
    .catch(err => setError('Network Error. Please try again later'))
  }

  if (user.id) {
    fave = user.favorites.filter(fave => fave.lake_id === lakeId)
  }

  function handleRemove() {
    if (!user.id) return setError('Please sign in.')
    fetch(`/favorites/${fave[0].id}`, {
      method: 'DELETE',
    })
    .then(r => {
      if (r.ok) {
          setUser(pre => {
            const newFavorites = [...pre.favorites.filter(fave => fave.lake_id !== lakeId)]
            return {...pre, favorites: newFavorites}
          })
      } else {
        r.json()
        .then(err => setError(err.error))
      }
    })
    .catch(err => setError('Network Error. Please try again later.'))
  }

  if (user.id) {
    added = user.favorites.filter(fave => {
      return fave.lake_id === lakeId
    })
  }

  return (
    <>
      {user.id && <button onClick={added.length > 0 ? handleRemove : handleAdd}>
        {added.length > 0 ? 'Remove From favorites' : 'Add to Favorites'}
      </button>}
      {error && <h2>{error}</h2>}
    </>
    
  )
}

export default AddFavorite