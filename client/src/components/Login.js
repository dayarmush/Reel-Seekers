import '../style/LoginForm.css'
import { useState } from 'react'

function Login({ setUser }) {

  const blankForm = {
    'username': '',
    'password': ''
  }

  const [error, setError] = useState('')
  const [form, setForm] = useState(blankForm)

  function handleChange(e) {
    let key = e.target.name
    let value = e.target.value
    
    setForm(pre => {
      return {...pre, [key]: value}
    })
  }

  function handleLogin(e) {
    e.preventDefault()

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
    .then(r => {
      if (r.ok) {
        r.json()
        .then(data => setUser(data))
      } else {
        r.json()
        .then(err => setError(err.error))
      }
    })
    .catch(err => setError('Network Error. Please try again later.'))
  }

  return (
    <div className='login-form-container'>
      <form onSubmit={handleLogin}>
        <label className='login-form-label'>Username:
          <input 
          className='login-form-input'
            placeholder="Username"
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>
        <label className='login-form-label'>Password:
          <input
          className='login-form-input'
            placeholder="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type='submit' className='login-form-button'>Login</button>
      </form>
      {error && <p className='login-form-error'>{error}</p>}
    </div>
  )
}

export default Login