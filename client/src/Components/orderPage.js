import React, { useEffect, useState } from 'react'
import api from '../constants/apiEndPoints'
import status from '../constants/statusCode'
import userType from '../constants/userType'

import { CompleteOrder } from './completeOrder'
import { AcceptOrder } from './acceptOrders'
import { AddOrder } from './addOrders'

const header = ["OrderID", "Date Created", "Pick up Location", "Drop off Location", "Price (Base: $2/mi)", "Range (mi)", "Status"];

export function OrderPage(props) {
    const [orderList, setOrderList] = useState([]);
    const [price, setPrice] = useState(0);
    const [range, setRange] = useState(0);
    const [pickUp, setPickUp] = useState("");
    const [dropOff, setDropOff] = useState("");

    const [completedOrderList, setCompletedOrderList] = useState([]);
    const [pendingOrderList, setPendingOrderList] = useState([]);

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

    useEffect(() => {
        if (props.user.type === userType.driver) {
            fetch(props.urlPend , {
                method: "GET",
                headers: new Headers({
                    "Authorization": props.auth
                })
            }).then(
                response => response.json()
            ).then(
                data => setPendingOrderList(data)
            ).catch(err => props.handleSetErr(err))}
        }, [])

    useEffect(() => {
        if (props.user.type === userType.driver) {
            fetch(props.urlCompl , {
                method: "GET",
                headers: new Headers({
                    "Authorization": props.auth
                })
            }).then(
                response => response.json()
            ).then(
                data => setCompletedOrderList(data)
            ).catch(err => props.handleSetErr(err))}
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

    const updatePendingList = async (event) => {
        event.preventDefault();
        const response = await fetch(props.urlPend , {
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
            setPendingOrderList(newList)
        }
    }

    const updateCompleteList = async (event) => {
        event.preventDefault();
        const response = await fetch(props.urlCompl , {
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
            setCompletedOrderList(newList)
        }
    }
    
    const orderListHeader = header.map((col) => <th key={col}>{col}</th>)

    const renderOrderList = orderList.map(order => {
        const date = new Date(order.createdAt);
        return (
            <tr key={order._id}> 
                <td>{order._id}</td> 
                <td>{date.toUTCString()}</td>
                <td>{order.pickupLocation}</td>
                <td>{order.dropoffLocation}</td>
                <td>${order.price}</td>
                <td>{order.range}</td>
                <td>{order.status}</td>
            </tr>
        )
    })

    const renderPendingOrderList = pendingOrderList.map(order => {
        const date = new Date(order.editedAt);
        return (
            <tr key={order._id}> 
                <td>{order._id}</td> 
                <td>{date.toUTCString()}</td>
                <td>{order.pickupLocation}</td>
                <td>{order.dropoffLocation}</td>
                <td>${order.price}</td>
                <td>{order.range}</td>
                <td>{order.status}</td>
            </tr>
        )
    })

    const renderCompletedOrderList = completedOrderList.map(order => {
        const date = new Date(order.editedAt);
        return (
            <tr key={order._id}> 
                <td>{order._id}</td> 
                <td>{date.toUTCString()}</td>
                <td>{order.pickupLocation}</td>
                <td>{order.dropoffLocation}</td>
                <td>${order.price}</td>
                <td>{order.range}</td>
                <td>{order.status}</td>
            </tr>
        )
    })

    let specificContent = <></>
    let specificContent2 = <></>
    if (props.user.type === userType.customer) {
        specificContent = <AddOrder handlePrice={handlePrice} handleRange={handleRange} handlePickUp={handlePickUp} 
        handleDropOff={handleDropOff} addOrder={addOrder} updateList={updateList}/>
    } else {
        specificContent = <AcceptOrder updateList={updateList} handleSetErr={props.handleSetErr} auth={props.auth}/>
        specificContent2 = <CompleteOrder updateList={updateList} handleSetErr={props.handleSetErr} auth={props.auth} /> 
    }

    if (props.user.type === userType.customer) {
        return (
            <>
            <div>
                <div class="order-page">
                    <h3>My Orders' page</h3>
                    <table className='table table-bordered'>
                        <thead>
                            {orderListHeader}
                        </thead>
                        <tbody>
                        {renderOrderList}
                        </tbody>
                    </table>
                    {specificContent}
                </div>
            </div>
            </>
        );
    } else {
        return (
            <>
            <div>
                <div class="order-page">
                    <h3>Available Orders' page</h3>
                    <table className='table table-bordered'>
                        <thead>
                            {orderListHeader}
                        </thead>
                        <tbody>
                        {renderOrderList}
                        </tbody>
                    </table>
                    {specificContent}
                    <div class='update-order-button'>
                        <button onClick={updateList}>update list</button>
                    </div>
                </div>
                <div class="order-page">
                    <h3>Pending Orders' page</h3>
                    <table className='table table-bordered'>
                        <thead>
                            {orderListHeader}
                        </thead>
                        <tbody>
                        {renderPendingOrderList}
                        </tbody>
                    </table>
                    {specificContent2}
                    <div class='update-order-button'>
                        <button onClick={updatePendingList}>update list</button>
                    </div>
                </div>
                <div class="order-page">
                    <h3>Completed Orders' page</h3>
                    <table className='table table-bordered'>
                        <thead>
                            {orderListHeader}
                        </thead>
                        <tbody>
                        {renderCompletedOrderList}
                        </tbody>
                    </table>
                    <div class='update-order-button'>
                        <button onClick={updateCompleteList}>update list</button>
                    </div>
                </div>
            </div>
            </>
        );
    }
}