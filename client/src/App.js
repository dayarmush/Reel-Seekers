import './App.css';
import Home from './components/Home';
import { Route , Routes } from 'react-router-dom'
import NavBar from './components/NavBar';

function App() {
  return (
    <>
      <NavBar/>
      <div>
        <Routes>
          <Route exact path='/' element={<Home />}/>
        </Routes>
      </div>
    </>
  );
}

export default App;
