import '../style/Review.css'
import { useState } from 'react'

function Reviews({ reviews, setLake, lakeId, user }) {
 // clear input field after submit
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

  async function handlePost(e) {
    e.preventDefault()
    if (!user.username) return setError('Please sign in')

    try {
      const response = await fetch('/reviews', {
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

      if (response.ok) {
        const data = await response.json()
        setNewReview({
          text: '',
          rating: 0
        })
        setLake(pre => {
          const newReviews = [...pre.reviews, data]
          return {...pre, reviews: newReviews}
        })
      } else {
        const err = await response.json()
        setError(err.error)
      }
    } catch {
      setError('Network error. Please try again later.')
    }
  }

  return (
    <div className='review-container'>
      <h2 id='fish-h2'>Reviews</h2>
      <div className='review-card-container'>
        {reviews.map(review => {
        return <div className='review-card' key={review.id}>
          <h2>Rating: {review.rating}</h2>
          <h3>{review.text}</h3>
          <h6>{review.user.username}</h6>
        </div>
      })}
      </div>
      <div className='review-input-container'>
        {user.id && 
          <div className='review-input'>
            <h3>Write a Review</h3>
            <form onSubmit={handlePost}>
              <input
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
              <button type='submit'>Post</button>
            </form>
            {error && <p>{error}</p>}
          </div>
        }
      </div>
    </div>
  )
}

export default Reviews