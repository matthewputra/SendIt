import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from 'react'
import {BrowserRouter} from 'react-router-dom'

import MainPage from './main/Main'
import Auth from './auth/Auth'

const EXAMPLE_USER = {
  userName: "user",
  firstName: "first",
  lastName: "last",
  userType: "customer"
}

function App() {
  const [auth, setAuth] = useState(localStorage.getItem("Authorization"));
  const [user, setUser] = useState(EXAMPLE_USER);

  const handleSetUser = (user) => {
    setUser(user)
  }

  const handleSetAuth = () => {
    let auth = localStorage.getItem("Authorization");
    setAuth(auth);
  }

  let content = <></>;
  if (auth) {
    content = <MainPage auth={auth} user={user} setAuth={handleSetAuth}/>
  } else {
    content = <Auth setUser={handleSetUser} setAuth={handleSetAuth}/>
  }
  return (
    <BrowserRouter>
      <div className="App">
        <header>
          SendIt App
        </header>
        <main>
          {content}
        </main>
        <footer>
          App created by Brandon Z. Ly, Matthey Putra, Saksham Aggarwal and Khoa Luong
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
