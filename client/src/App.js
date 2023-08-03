import './App.css';
import Home from './components/Home';
import NavBar from './components/NavBar';
import Signup from './components/Signup';
import NewFish from './components/NewFish';
import NewLake from './components/NewLake';
import { useEffect, useState } from 'react';
import LoginPage from './components/LoginPage';
import LakeDetail from './components/LakeDetail';
import { useLoadScript } from "@react-google-maps/api";
import { Navigate, Route , Routes } from 'react-router-dom';

function App() {

  const [user, setUser] = useState([])
  const [lake, setLake] = useState([])
  const [lakes, setLakes] = useState([])
  const [error, setError] = useState('')
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

  useEffect(() => {
    fetch('/lakes')
    .then(r => {
      if (r.ok) {
        r.json()
        .then(data => {
          setLakes(data)
        })
      } else {
        r.json()
        .then(err => {
          setError(err.error)
        })
      }
    })
    .catch(err => {
      setError('Network Error.', 'Please try again later.')
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
          
          <Route 
            exact path='/' 
            element={
              <Home 
                isLoaded={isLoaded}
                lakes={lakes}
                error={error}
              />
            }
          />

          <Route 
            path='/user/' 
            element={
              <LoginPage 
                user={user} 
                setUser={setUser}
                lakes={lakes}
              />
            }
          />

          <Route 
            path='/lake/:id' 
            element={
              <LakeDetail 
                user={user} 
                isLoaded={isLoaded} 
                setUser={setUser} 
                lake={lake} 
                setLake={setLake}
              />
            }
          />

          <Route 
            path='/new/fish/:lakeId' 
            element={
              <NewFish 
                setLake={setLake}
              />
            }
          />

          <Route
            path='/new/user'
            element={
              <Signup 
                setUser={setUser}
              />
            }
          />

          <Route
            path='/new/lake'
            element={
              <NewLake
                lakes={lakes}
                setLakes={setLakes}
                isLoaded={isLoaded}
              />
            }
          />

          <Route
            path='*'
            element={
              <Navigate to='/'/>
            }
          />

        </Routes>
      </div>
    </>
  );
}

export default App;
