import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from 'react'
import {BrowserRouter} from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'

import MainPage from './Main/Main'
import Auth from './Auth/Auth'
import api from './constants/apiEndPoints';
import status from './constants/statusCode'

const EXAMPLE_USER = {
  userName: "user",
  firstName: "first",
  lastName: "last",
  userType: "customer"
}

function App() {
  const [auth, setAuth] = useState(localStorage.getItem("Authorization"));
  const [user, setUser] = useState({});
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!auth) return;
    fetch(api.base + api.handlers.login,{
      method: "GET",
      headers: new Headers({
        "Authorization": auth
      })
    })
    .then(response => response.json())
    .then(data => setUser(data))
    .catch(err => {
      setErr("Session expired, logging out");
      localStorage.setItem("Authorization", "");
      setAuth("");
      setUser({});
    })
  }, []);

  const handleSetUser = (user) => {
    setUser(user);
  }

  const handleSetAuth = (auth) => {
    setAuth(auth);
  }

  const handleSetErr = (err) => {
    setErr(err);
  }

  function checkErr() {
    if (err !== "") {
      return <Alert variant="primary">Error: {err}</Alert>
    }
    return <></>
  }

  let renderErr = checkErr();

  let content = <></>;
  if (auth) {
    content = <MainPage auth={auth} user={user} handleSetErr={handleSetErr} handleSetUser={handleSetUser}  handleSetAuth={handleSetAuth}/>
  } else {
    content = <Auth handleSetErr={handleSetErr} handleSetUser={handleSetUser}  handleSetAuth={handleSetAuth}/>
  }
  return (
    <Container>
      <header>
        <h1 class='project-title'>SendIt App</h1>
      </header>
      <main>
        {content}
        <div class='space-maker'></div>
        {renderErr}
      </main>
      <footer class="page-footer font-small blue">
        <div class="footer-copyright text-center py-3" id='footer'>
        App created by Brandon Z. Ly, Matthey Putra, Saksham Aggarwal and Khoa Luong
        </div>
      </footer>
      {/* <footer class='footer'>
        App created by Brandon Z. Ly, Matthey Putra, Saksham Aggarwal and Khoa Luong
      </footer> */}
    </Container>
  );
}

export default App;
