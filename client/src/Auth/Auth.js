import React, { useState } from 'react'
import './Auth.css';
import api from '../constants/apiEndPoints'
import status from '../constants/statusCode'
import type from '../constants/userType'

// const EXAMPLE_NEW_USER = {
//     email: "test3@test.com",
//     password: "password",
//     passwordConf: "password",
//     userName: "hahaha",
//     firstName: "firstlol",
//     lastName: "lastlol",
//     type: "customer"
// };

// const EXAMPLE_LOGIN = {
//     email: "test3@test.com",
//     password: "password"
// }

export default function Auth(props) {
    return (
        <>
        <SignIn handleSetErr={props.handleSetErr} handleSetUser={props.handleSetUser} handleSetAuth={props.handleSetAuth}/>
        <SignUp handleSetErr={props.handleSetErr} handleSetUser={props.handleSetUser} handleSetAuth={props.handleSetAuth}/>
        </>
    );
}

export function SignIn(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmail = (event) => {
        setEmail(event.target.value);
    }

    const handlePassword = (event) => {
        setPassword(event.target.value);
        console.log(password);
    }

    const handleSignIn = async (event) => {
        event.preventDefault();
        let url = api.base + api.handlers.login;
        let sendData = {
            email: email,
            password: password
        };
        //let sendData = EXAMPLE_LOGIN;
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(sendData),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        })

        if (response.status !== status.ok) {
            const err = await response.text();
            props.handleSetErr(err)
        } else {
            const authToken = response.headers.get("Authorization")
            localStorage.setItem("Authorization", authToken);
            props.handleSetAuth(authToken)
            const user = await response.json();
            props.handleSetUser(user)
            props.handleSetErr("");
        }
    }

    return (
        <>
        <div>
            <h2>Sign In</h2>
            <form>
                <div class='form-group'>
                    <label for="exampleInputEmail1">Email address</label>
                    <input type="email" class="form-control" id="exampleInputEmail1" aria-label="email" aria-describedby="emailHelp" placeholder="Enter email" onChange={handleEmail}></input>
                    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div class="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" onChange={handlePassword}></input>
                </div>
                <button type="submit" class="btn btn-primary" onClick={handleSignIn}>Sign In</button>
            </form>
            {/* <form>
                <input placeholder="email" aria-label="email" onChange={handleEmail}></input>
                <input placeholder="password" type="password" aria-label="password" onChange={handlePassword}></input>
                <button onClick={handleSignIn}>sign in</button>
            </form> */}
        </div>
        </> 
    );
}

export function SignUp(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userType, setUserType] = useState("");

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
            type: userType
        };
        //let sendData = EXAMPLE_NEW_USER;
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(sendData),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        })

        if (response.status !== status.created) {
            const err = await response.text();
            props.handleSetErr(err)
        } else {
            const authToken = response.headers.get("Authorization")
            localStorage.setItem("Authorization", authToken);
            props.handleSetAuth(authToken)
            const user = await response.json()
            props.handleSetUser(user)
            props.handleSetErr("");
        }
    }

    return (
        <>
        <div class="container" id="sign-up">
        	<div class="panel panel-default">
        		<div class="panel-heading">
			    		<h3 class="panel-title">Please sign up if you don't have an account!</h3>
			 			</div>
			 			<div class="panel-body">
			    		<form role="form">
			    			<div class="row">
			    				<div class="col-xs-6 col-sm-6 col-md-6">
			    					<div class="form-group">
			                            <input type="text" name="first_name" id="first_name" class="form-control input-sm" placeholder="First Name" onChange={handleFirstName}></input>
			    					</div>
			    				</div>
			    				<div class="col-xs-6 col-sm-6 col-md-6">
			    					<div class="form-group">
			    						<input type="text" name="last_name" id="last_name" class="form-control input-sm" placeholder="Last Name" onChange={handleLastName}></input>
			    					</div>
			    				</div>
			    			</div>
                            
                            <div class="form-group">
			    				<input type="username" name="username" id="email" class="form-control input-sm" placeholder="Username" onChange={handleUserName}></input>
			    			</div>

			    			<div class="form-group">
			    				<input type="email" name="email" id="email" class="form-control input-sm" placeholder="Email Address" onChange={handleEmail}></input>
			    			</div>

                            <div class="form-group">
                                <input type="password" name="password" id="password" class="form-control input-sm" placeholder="Password" onChange={handlePassword}></input>
                            </div>

                            <div class="form-group">
                                <input type="usertype" name="usertype" id="password" class="form-control input-sm" placeholder="'customer' or 'driver'" onChange={handleUserType}></input>
                            </div>
			    			
			    			<button class="btn btn-info btn-block" onClick={handleSignUp}>Register</button>
			    		
			    		</form>
			    	</div>
	    		</div>
        </div>
            {/* <h2>sign up</h2>
            <form>
                <input placeholder="email" aria-label="email" onChange={handleEmail}></input>
                <input placeholder="password" type="password" aria-label="password" onChange={handlePassword}></input>
                <input placeholder="username" aria-label="username" onChange={handleUserName} />
                <input placeholder="first name" aria-label="first name" onChange={handleFirstName} />
                <input placeholder="last name" aria-label="last name" onChange={handleLastName} />
                <input placeholder="customer or driver" aria-label="user type" onChange={handleUserType} />
                <input type="radio" id={type.customer} name="userType" value={type.customer}>Customer</input>
                <input type="radio" id={type.driverr} name="userType" value={type.driverr}>Driver</input>
                <button onClick={handleSignUp}>sign up</button>
            </form> */}
        </>
    )
}