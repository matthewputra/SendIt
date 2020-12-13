import React, { useState } from 'react'
import api from '../constants/apiEndPoints'
import status from '../constants/statusCode'

export default function Auth(props) {
    return (
        <>
        <SignIn />
        <SignUp />
        </>
    );
}

export function SignIn(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmail = (event) => {
        setEmail(event.target.value);
    }
    console.log("Email: " + email);

    const handlePassword = (event) => {
        setPassword(event.target.value);
        console.log(password);
    }
    console.log("Password: " + password);

    const handleSignIn = async (event) => {
        event.preventDefault();
        let url = api.base + api.handlers.login;
        let sendData = {
            email: email,
            password: password
        };
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(sendData),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        })

        if (response.status !== status.ok) {
            const err = await response.text;
            console.log(err)
        } else {
            const authToken = response.headers.get("Authorization")
            localStorage.setItem("Authorization", authToken);
            const user = await response.json()
            props.setUser(user)
        }
    }

    return (
        <>
            <p>sign in</p>
            <form>
                <input aria-label="email" onChange={handleEmail}></input>
                <input aria-label="password" onChange={handlePassword}></input>
                <button onClick={handleSignIn}>sign in</button>
            </form>
        </> 
    );
}

export function SignUp(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userType, setUserType] = useState("customer");

    const handleEmail = (event) => {
        setEmail(event.target.value);
    }
    const handlePassword = (event) => {
        setPassword(event.target.value);
    }

    const handleUserName = (event) => {
        setUserName(event.target.value);
    }

    const handleFirstName = (event) => {
        setFirstName(event.target.value);
    }

    const handleLastName = (event) => {
        setLastName(event.target.value);
    }

    const handleUserType = (event) => {
        setUserType(event.target.value);
    }

    const handleSignUp = async (event) => {
        event.preventDefault();
        let url = api.base + api.handlers.signUp;
        let sendData = {
            email: email,
            password: password,
            passwordConf: password,
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            userType: userType
        };
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(sendData),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        })

        if (response.status !== status.created) {
            const err = await response.text;
            console.log(err)
        } else {
            const authToken = response.headers.get("Authorization")
            localStorage.setItem("Authorization", authToken);
            const user = await response.json()
            props.setUser(user)
        }
    }

    return (
        <>
        <p>sign up</p>
        <form>
            <input aria-label="email" onChange={handleEmail}></input>
            <input aria-label="password" onChange={handlePassword}></input>
            <input aria-label="username" onChange={handleUserName} />
            <input aria-label="first name" onChange={handleFirstName} />
            <input aria-label="last name" onChange={handleLastName} />
            <input aria-label="user type" onChange={handleUserType} />
            <button onClick={handleSignUp}>sign up</button>
        </form>
        </>
    )
}