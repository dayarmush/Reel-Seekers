import './App.css';
import Home from './components/Home';
import { Route , Routes } from 'react-router-dom'
import NavBar from './components/NavBar';
import LoginPage from './components/LoginPage';
import LakeDetail from './components/LakeDetail'
import { useEffect, useState } from 'react';
import { useLoadScript } from "@react-google-maps/api"

function App() {

  const [user, setUser] = useState([])
  const [ libraries ] = useState(['places'])

  useEffect(() => {
    fetch('/check_session')
    .then(r => {
      if (r.ok) {
        r.json()
        .then(data => setUser(data))
      } 
    })
  }, [])

  let key = process.env.REACT_APP_API_KEY

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: key,
    libraries
  });

  return (
    <>
      <NavBar/>
      <div>
        <Routes>
          <Route exact path='/' element={<Home isLoaded={isLoaded}/>}/>

          <Route path='/login' element={<LoginPage user={user} setUser={setUser} />}/>

          <Route path='/lake/:id' element={<LakeDetail user={user} isLoaded={isLoaded}/>}/>
        </Routes>
      </div>
    </>
  );
}

export default App;
