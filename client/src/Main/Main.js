import React, { useState } from 'react'
import './Main.css';

import api from '../constants/apiEndPoints'
import userType from '../constants/userType'

import { OrderPage } from '../Components/orderPage'
import { UserProfile } from '../Components/userProfile'

export default function MainPage(props) {
    const [page, setPage] = useState("Profile");

    const changeToOrder = () => {
        setPage("Order")
    }

    const changeToProfile = () => {
        setPage("Profile")
    }

    let content = <></>
    if (page === "Profile") {
        let urlDrEarn = ""
        if (props.user.type === userType.driver) {
            urlDrEarn = api.base + api.handlers.driver + api.handlers.earning
        }
        content = <UserProfile user={props.user} urlDrEarn={urlDrEarn} auth={props.auth} handleSetErr={props.handleSetErr} handleSetUser={props.handleSetUser}  handleSetAuth={props.handleSetAuth}/>
    } else if (page === "Order") {
        let url = "";
        let urlCompl = "";
        let urlPend = "";
        if (props.user.type === userType.customer) {
            url = api.base + api.handlers.customer + "/" + props.user.id + api.handlers.order
        } else {
            url = api.base + api.handlers.driver + "/" + api.handlers.available
            urlPend = api.base + api.handlers.driver + "/" + props.user.id + api.handlers.orderList
            urlCompl = api.base + api.handlers.driver + "/" + api.handlers.complete 
        }
        content = <OrderPage user={props.user} url={url} urlCompl={urlCompl} urlPend={urlPend} auth={props.auth} handleSetErr={props.handleSetErr}/>
    }

    return (
    <div>
        <h2>Main page</h2>
        <div class="container justify-content-center">
            <div class="card p-3">
                <div class="d-flex align-items-center">
                    <div class="ml-3 w-100">
                        <div class="button mt-2 d-flex flex-row align-items-center"> 
                            <button class="btn btn-outline-primary w-100" onClick={changeToOrder}>Show Order List</button> 
                        </div>
                        <div class="button mt-2 d-flex flex-row align-items-center"> 
                            <button class="btn btn-outline-primary w-100" onClick={changeToProfile}>Show Profile</button> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {content}
    </div>
    );
}