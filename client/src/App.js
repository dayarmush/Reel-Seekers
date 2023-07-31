import './App.css';
import Home from './components/Home';
import { Route , Routes } from 'react-router-dom'
import NavBar from './components/NavBar';
import LoginPage from './components/LoginPage';
import LakeDetail from './components/LakeDetail'

function App() {
  return (
    <>
      <NavBar/>
      <div>
        <Routes>
          <Route exact path='/' element={<Home />}/>

          <Route path='/login' element={<LoginPage />}/>

          <Route path='/lake/:id' element={<LakeDetail />}/>
        </Routes>
      </div>
    </>
  );
}

export default App;
