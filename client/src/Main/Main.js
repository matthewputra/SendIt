import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'

import api from '../constants/apiEndPoints'
import status from '../constants/statusCode'
import userType from '../constants/userType'

const TEST_URL = "https://api.serversideisfun.me/v1/customer/4/order"

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
        content = <UserProfile user={props.user} handleSetErr={props.handleSetErr} handleSetUser={props.handleSetUser}  handleSetAuth={props.handleSetAuth}/>
    } else if (page === "Order") {
        let url = "";
        if (props.user.type === userType.customer) {
            url = api.base + api.handlers.customer + "/" + props.user.id + api.handlers.order
        } else {
            url = api.base + api.handlers.driver + "/" + props.user.id + api.handlers.orderList
        }
        content = <OrderPage user={props.user} url={url} auth={props.auth} handleSetErr={props.handleSetErr}/>
    }

    return (
    <div>
        <h2>main page</h2>
        {content}
        <button onClick={changeToOrder}>show order list</button>
        <button onClick={changeToProfile}>show user profile</button>
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
    const [orderList, setOrderList] = useState([]);
    const [price, setPrice] = useState(0);
    const [range, setRange] = useState(0);
    const [pickUp, setPickUp] = useState("");
    const [dropOff, setDropOff] = useState("");

    useEffect(() => {
        fetch(props.url , {
            method: "GET",
            headers: new Headers({
                "Authorization": props.auth
            })
        }).then(
            response => response.json()
        ).then(
            data => setOrderList(data)
        ).catch(err => props.handleSetErr(err))
    }, [])

    const handlePrice = (event) => {
        setPrice(parseInt(event.target.value));
    }

    const handleRange = (event) => {
        setRange(parseInt(event.target.value));
    }

    const handlePickUp = (event) => {
        setPickUp(event.target.value);
    }

    const handleDropOff = (event) => {
        setDropOff(event.target.value)
    }

    const addOrder = async (event) => {
        event.preventDefault();
        const url = props.url;
        const sendData = {
            price: price,
            range: range,
            pickupLocation: pickUp,
            dropoffLocation: dropOff
        };
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(sendData),
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": props.auth
            })
        });

        if (response.status !== status.created) {
            const err = await response.text();
            props.handleSetErr(err)
        } else {
            setPrice(0);
            setRange(0);
            setPickUp("");
            setDropOff("");
            props.handleSetErr("");
        }
    }

    const updateList = async (event) => {
        event.preventDefault();
        const response = await fetch(props.url , {
            method: "GET",
            headers: new Headers({
                "Authorization": props.auth
            })
        })

        if (response.status !== status.ok) {
            const err = await response.text();
            props.handleSetErr(err)
        } else {
            const newList = await response.json();
            setOrderList(newList)
        }
    }
    
    const renderOrderList = orderList.map(order => {return <p key={order._id}> {order._id} {order.customerID} {Date(order.createdAt)} {order.status}</p>})

    let specificContent = <></>
    if (props.user.type === userType.customer) {
        specificContent = <AddOrder handlePrice={handlePrice} handleRange={handleRange} handlePickUp={handlePickUp} 
        handleDropOff={handleDropOff} addOrder={addOrder} updateList={updateList}/>
    } else {
        specificContent = <ProcessOrder updateList={updateList} handleSetErr={props.handleSetErr} auth={props.auth}/>
    }

    return (
        <>
            <h3>order page</h3>
            {renderOrderList}
            {specificContent}
        </>
    );
}

function AddOrder(props) {
    return (
        <form>
            <input aria-label="price" onChange={props.handlePrice}></input>
            <input aria-label="range" onChange={props.handleRange}></input>
            <input aria-label="pick up" onChange={props.handlePickUp}/>
            <input aria-label="drop off" onChange={props.handleDropOff}/>
            <button onClick={props.addOrder}>add order</button>
            <button onClick={props.updateList}>update order list</button>
        </form>
    );
}

function ProcessOrder(props) {
    const [orderID, setOrderID] = useState("");
    const [order, setOrder] = useState({});
    const [accepted, setAccepted] = useState(false);

    const handleOrderID = (event) => {
        setOrderID(event.target.value)
    }

    const handleOrderDetail = async (event) => {
        event.preventDefault();

        const response = await fetch(api.base + api.handlers.driver + api.handlers.accept + "/" + orderID, {
            method: "PATCH",
            headers: new Headers({
                "Authorization": props.auth
            })
        });

        if (response.status !== status.ok) {
            const err = await response.text();
            props.handleSetErr(err);
        } else {
            const orderInfo = response.json();
            setOrder(orderInfo)
            props.handleSetErr("");
            setAccepted(true);
        }
    }

    const completeOrder = async (event) => {
        event.preventDefault();
        const response = await fetch(api.base + api.handlers.driver + api.handlers.complete + "/" + orderID, {
            method: "PATCH",
            headers: new Headers({
                "Authorization": props.auth
            })
        });

        if (response.status !== status.ok) {
            const err = await response.text();
            props.handleSetErr(err);
        } else {
            setAccepted(false);
            props.handleSetErr("");
            props.updateList(event);
        }
    }

    let completeOrderButton = <button onClick={handleOrderDetail}>accept order</button>
    if (!accepted) {
        completeOrderButton = <button onClick={completeOrder}>complete order</button>
    }

    return (<>
        <div>
            <form>
                <input aria-label="order id" onChange={handleOrderID}></input>
                {completeOrderButton}
            </form>
            <p>Order info</p>
            <p>{order._id} {order.customerID} {Date(order.createdAt)} {order.driverID} {order.range} {order.price} {order.pickupLocation} {order.dropoffLocation}</p>
        </div>
    </>
    );
}