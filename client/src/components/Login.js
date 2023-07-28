import { useState } from 'react'

function Login() {

  const blankForm = {
    'username': '',
    'password': ''
  }

  const [form, setForm] = useState(blankForm)
  const [error, setError] = useState('')
  const [user, setUser] = useState([])

  function handleChange(e) {
    let key = e.target.name
    let value = e.target.value
    
    setForm(pre => {
      return {...pre, [key]: value}
    })
  }

  function handleLogin() {
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
    <div>
      <label>Username:
        <input 
          placeholder="Username"
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
        />
      </label>
      <label>Password:
        <input
          placeholder="Password"
          type="text"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
      </label>
      <button onClick={handleLogin}>Login</button>
      {error && <p>{error}</p>}
    </div>
  )
}

export default Login