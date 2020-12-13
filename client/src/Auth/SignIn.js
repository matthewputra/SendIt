import React, { useState } from 'react'

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

    return (
        <>
            <p>sign in</p>
            <form>
                <input aria-label="email" onChange={handleEmail}></input>
                <input aria-label="password" onChange={handlePassword}></input>
                <button>sign in</button>
            </form>
        </> 
    );
}

export function SignUp(props) {
    const[newUser, setNewUser] = useState({
        email: "",
        password: "",
        passwordConf: "",
        userName: "",
        firstName: "",
        lastName: "",
        userType: ""
    })

    return (
        <p>sign up</p>
    )
}