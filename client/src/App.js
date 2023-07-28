import './App.css';
import Home from './components/Home';
import { Route , Routes } from 'react-router-dom'
import NavBar from './components/NavBar';
import Login  from './components/Login';

function App() {
  return (
    <>
      <NavBar/>
      <div>
        <Routes>
          <Route exact path='/' element={<Home />}/>

          <Route path='/login' element={<Login />}/>
        </Routes>
      </div>
    </>
  );
}

export default App;
