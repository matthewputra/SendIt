import React from 'react'
import { Button } from 'react-bootstrap'
import { Route, Switch } from 'react-router-dom'
import api from '../constants/apiEndPoints'

export default function MainPage(props) {
    console.log(props.user)

    const renderProfile = (renderProps) => {
        return <UserProfile {...renderProps} user={props.user} handleSetErr={props.handleSetErr} handleSetUser={props.handleSetUser}  handleSetAuth={props.handleSetAuth}/>
    }

    const renderOrder = (renderProps) => {
        return <OrderPage {...renderProps} user={props.user} />
    }

    return (
    <div>
        <p>main page</p>
        <Switch>
            <Route exact path="/" render={renderProfile} />
            <Route path="/order" render={renderOrder} />
        </Switch>
    </div>
    );
}

function UserProfile(props) {
    const handleLogOut = async (event) => {
        event.preventDefault();
        const response = await fetch(api.base + api.handlers.login, {
            method: "DELETE",
            headers: new Headers({
                "Authorization": localStorage.getItem("Authorization")
            })
        });
        if (response.status >= 300) {
            const error = await response.text();
            console.log(error)
            props.handleSetErr(error);
        } else {
            localStorage.removeItem("Authorization");
            props.handleSetUser({});
            props.handleSetAuth("");
            props.handleSetErr("");
        }
    }
    return (
        <>
            <p>user profile</p>
            <p>user name: {props.user.userName}</p>
            <p>first name: {props.user.firstName}</p>
            <p>you are a {props.user.type}</p>
            <button onClick={handleLogOut}>log out</button>
        </>
    );
}

function OrderPage(props) {
    return (
        <>
            <p>order page</p>
        </>
    );
}