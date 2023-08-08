import '../style/Signup.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Signup({ setUser }) {

  const navigate = useNavigate()

  const [error, setError] = useState('')
  const [form, setForm] = useState({
    'username': '',
    'password': ''
  })

  const handleChange = (e) => {
    const key = e.target.name
    const value = e.target.value
    setForm(pre => {
      return {...pre, [key]: value}
    })
  }

  const handleSignup = (e) => {
    setError('')
    e.preventDefault()

    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
    .then(r => {
      if (r.ok) {
        r.json()
        .then(newUser => setUser(newUser))
        .then(navigate('/user'))
      } else {
        r.json()
        .then(err => setError(err.error))
      }
    })
    .catch(err => setError('Network Error. Please try again later.'))
  }

  return(
    <div className='signup-form-container'>
      <form onSubmit={handleSignup}>
        <label className='signup-form-label'>Username:</label>
          <input
            className='signup-form-input'
            placeholder='Username'
            type='text'
            name='username'
            value={form.username}
            onChange={handleChange}
            required
          />
        <label className='signup-form-label'>Password:</label>
          <input
            className='signup-form-input'
            placeholder='Password'
            type='password'
            name='password'
            value={form.password}
            onChange={handleChange}
            required
          />
        <button type='submit' className='signup-form-button'>Signup</button>
      </form>
      {error && <h2 className='signup-form-error'>{error}</h2>}
    </div>
  )
}

export default Signup