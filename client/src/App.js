import './App.css';
import Home from './components/Home';
import NavBar from './components/NavBar';
import Signup from './components/Signup';
import NewFish from './components/NewFish';
import { useEffect, useState } from 'react';
import LoginPage from './components/LoginPage';
import LakeDetail from './components/LakeDetail';
import { Route , Routes } from 'react-router-dom';
import { useLoadScript } from "@react-google-maps/api";



function App() {

  const [user, setUser] = useState([])
  const [lake, setLake] = useState([])
  const [ libraries ] = useState(['places'])
  console.log(user)
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
          
          <Route 
            exact path='/' 
            element={
              <Home 
                isLoaded={isLoaded}
              />
            }
          />

          <Route 
            path='/user/' 
            element={
              <LoginPage 
                user={user} 
                setUser={setUser} 
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

        </Routes>
      </div>
    </>
  );
}

export default App;
