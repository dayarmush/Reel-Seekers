import Login from './Login'

function LoginPage({ user, setUser }) {

  return (
    <div>
      {!user.username && <Login setUser={setUser}/>}
      {user.username && <h2>Welcome: {user.username}</h2>}
    </div>
    
  )
}

export default LoginPage