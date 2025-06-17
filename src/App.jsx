import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from "react";
import Home from './components/Home';
import Guest from './components/Guest';
import './App.css';
import Signup from './components/Signup';
import Signin from './components/Signin';
import GuestWithId from './components/GuestWithId';
import Notfound from './components/Notfound';
import { Toaster } from 'react-hot-toast'
import EmailVerify from './components/EmailVerify';
import IDE from './components/IDE';
import Chat from './components/Chat';
import Contact from './components/Contact';
import About from './components/About';
import ResetPassword from './components/ResetPassword';
import Links from './components/Links';

function BodyClassManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/guest" || location.pathname === "/notfound" || location.pathname === "/ide" || location.pathname === "/chat") {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    if (location.pathname === "/"){
      sessionStorage.removeItem('slink');
      sessionStorage.removeItem('haveid');
    }
  }, [location.pathname]);

  return null;
}



function App() {
  return (
    <>
    <Toaster reverseOrder={false} />
    <Router>
      <BodyClassManager />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/guest' element={<Guest />} />
        <Route path='/ide' element={<IDE />} />
        <Route path='/notfound' element={<Notfound />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/guest/:id' element={<GuestWithId />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/about' element={<About />} />
        <Route path='/links' element={<Links />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
