import React, { useEffect, useState } from 'react'
import api from '../constants/apiEndPoints'
import status from '../constants/statusCode'
import userType from '../constants/userType'

export function UserProfile(props) {
    const [earnings, setEarnings] = useState("") 

    const handleEarnings = async (event) => {
        event.preventDefault();
        const response = await fetch(props.urlDrEarn , {
            method: "GET",
            headers: new Headers({
                "Authorization": props.auth
            })
        })

        if (response.status !== status.ok) {
            const err = await response.text();
            props.handleSetErr(err)
        } else {
            const total = await response.text();
            setEarnings(total)
        }
    }

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
            props.handleSetErr(error);
        } else {
            localStorage.removeItem("Authorization");
            props.handleSetUser({});
            props.handleSetAuth("");
            props.handleSetErr("");
        }
    }

    if (props.user.type === userType.customer) {
        return (
            <>
                <div class="container justify-content-center user-profile">
                    <div class="card p-3">
                        <div class="d-flex align-items-center">
                            <div class="image"> <img src="https://i.ibb.co/HCrg2Nf/User.png" class="rounded" width="155"/> </div>
                            <div class="ml-3 w-100">
                                <h4 class="mb-0 mt-0">{props.user.firstName} {props.user.lastName}</h4> 
                                <div class="user-info">
                                    <h6>UserType: {props.user.type}</h6>
                                    <h6>Email: {props.user.email}</h6>
                                </div>
                                <div class="button mt-2 d-flex flex-row align-items-center"> 
                                    <button class="btn btn-sm btn-outline-primary w-100" onClick={handleLogOut}>Logout</button> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div class="container justify-content-center user-profile">
                    <div class="card p-3">
                        <div class="d-flex align-items-center">
                            <div class="image"> <img src="https://i.ibb.co/HCrg2Nf/User.png" class="rounded" width="155"/> </div>
                            <div class="ml-3 w-100">
                                <h4 class="mb-0 mt-0">{props.user.firstName} {props.user.lastName}</h4> 
                                <div class="user-info">
                                    <h6>UserType: {props.user.type}</h6>
                                    <h6>Email: {props.user.email}</h6>
                                </div>
                                <div class="button mt-2 d-flex flex-row align-items-center"> 
                                    <button class="btn btn-outline-primary w-100" onClick={handleEarnings}>Total earnings: ${earnings}</button> 
                                </div>
                                <div class="button mt-2 d-flex flex-row align-items-center"> 
                                    <button class="btn btn-outline-primary w-100" onClick={handleLogOut}>Logout</button> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}