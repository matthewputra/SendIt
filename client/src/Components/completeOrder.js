import React, { useEffect, useState } from 'react'
import api from '../constants/apiEndPoints'
import status from '../constants/statusCode'

export function CompleteOrder(props) {
    const [orderID, setOrderID] = useState("");
    const [order, setOrder] = useState({});

    const handleOrderID = (event) => {
        setOrderID(event.target.value)
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
            const orderInfo = response.json();
            setOrder(orderInfo);
            props.handleSetErr("");
            props.updateList(event);
        }
    }

    let completeOrderButton = <></>
    completeOrderButton = <button onClick={completeOrder}>complete order</button>

    return (<>
        <div>
            <form>
                <input aria-label="order id" placeholder="Enter OrderID" onChange={handleOrderID}></input>
                {completeOrderButton}
            </form>
        </div>
    </>
    );
}