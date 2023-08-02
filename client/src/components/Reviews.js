import { useState } from 'react'

function Reviews({ reviews, setLake, lakeId, user }) {
 
  const [error, setError] = useState('')
  const [newReview, setNewReview] = useState({
    text: '',
    rating: 0
  })
  
  function handleChange(e) {
    const key = e.target.name
    const value = e.target.value

    setNewReview(pre => {
      return {...pre, [key]: value}
    })
  }

  function handlePost() {
    if (!user.username) return setError('Please sign in')
    fetch('/reviews', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        text: newReview.text,
        rating: Number(newReview.rating),
        user_id: user.id,
        lake_id: lakeId
      })
    })
    .then(r => {
      if (r.ok) {
        r.json()
        .then(data => {
          setLake(pre => {
            const newReviews = [...pre.reviews, data]
            return {...pre, reviews: newReviews}
          })
        })
      } else {
        r.json()
        .then(err => setError(err.error))
      }
    })
    .catch(err => setError('Network error. Please try again later.'))
  }

  return (
    <div>
      {reviews.map(review => {
        return <div key={review.id}>
          <h2>Rating: {review.rating}</h2>
          <h3>{review.text}</h3>
          <h6>{review.user.username}</h6>
        </div>
      })}
      {user.id && 
        <div>
          <input
            placeholder='Rating'
            type='number'
            min='0'
            max='5'
            name='rating'
            value={newReview.rating}
            onChange={handleChange}
            required
          />
          <input
            placeholder='Review'
            type='text'
            name='text'
            value={newReview.text}
            onChange={handleChange}
          />
          <button onClick={handlePost}>Post</button>
        </div>
      }
      
      {error && <h2>{error}</h2>}
    </div>
  )
}

export default Reviews