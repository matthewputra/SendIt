import React, { useEffect, useState } from 'react'
import api from '../constants/apiEndPoints'
import status from '../constants/statusCode'

export function AddOrder(props) {
    return (
        <div>
        <div class="button mt-2 d-flex flex-row align-items-center"> 
            <button class="btn btn-sm btn-outline-primary w-100" onClick={props.updateList}>Update Order List</button> 
        </div>
        <div class="container pt-4 add-order">
        <h4>Order Form</h4>
        <form>
            <div class='form-group'>
                <label for="firstname">Recipient's First Name</label>
                <input type="first name" class="form-control" aria-label="firstname" placeholder="First"></input>
            </div>
            <div class='form-group'>
                <label for="lastname">Recipient's Last Name</label>
                <input type="last name" class="form-control" aria-label="lastname" placeholder="Last"></input>
            </div>
            <div class='form-group'>
                <label for="pickup">Pick up Location</label>
                <input class="form-control" aria-label="pickup" placeholder="Enter complete address (street, city, state)" onChange={props.handlePickUp}></input>
            </div>
            <div class='form-group'>
                <label for="drop off">Drop off Location</label>
                <input class="form-control" aria-label="drop off" placeholder="Enter complete address (street, city, state)" onChange={props.handleDropOff}></input>
            </div>
            <button class="btn btn-primary add-button" onClick={props.addOrder}>Place Order</button>
        </form>
        </div>
        </div>
    );
}