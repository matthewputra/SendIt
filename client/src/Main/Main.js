import React from 'react'
import { Route, Switch } from 'react-router-dom'

export default function MainPage(props) {

    const renderProfile = (renderProps) => {
        return <UserProfile {...renderProps} user={props.user}/>
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
    return (
        <>
            <p>user profile</p>
            <p>user name: {props.user.userName}</p>
            <p>first name: {props.user.firstName}</p>
            <p>you are a {props.user.userType}</p>
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