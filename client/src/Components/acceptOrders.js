import React, { useEffect, useState } from 'react'
import api from '../constants/apiEndPoints'
import status from '../constants/statusCode'

export function AcceptOrder(props) {
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

    let acceptOrderButton = <button onClick={handleOrderDetail}>accept order</button>

    return (<>
        <div>
            <form>
                <input aria-label="order id" placeholder="Enter OrderID" onChange={handleOrderID}></input>
                {acceptOrderButton}
            </form>
        </div>
    </>
    );
}