import { BrowserRouter, Routes, Route } from 'react-router-dom';

import logo from './logo.svg';
import './App.css';
import Login from './pages/login/login';
import Signup from './pages/signup/signup';
import Home from './pages/home/home';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
