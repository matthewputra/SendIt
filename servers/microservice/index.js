const express = require("express");
const mongoose = require("mongoose");
const mysql = require('mysql2/promise');
const { OrderSchema } = require("./schemas/order");
const { getCustomerOrders, 
        createNewOrderHandler } = require("./handlers/customer/customerSpecificHandlers");
const { getAssignedOrdersHandlers, 
        getCompletedOrdersHandlers, 
        getTotalEarnings } = require("./handlers/driver/driverSpecificHandlers");
const { acceptOrderHandler, 
        completeOrderHandler } = require("./handlers/driver/orderSpecificHandlers")

var mysqlConn = mysql.createPool({
                            host: '<container-name>',
                            port: '3306',
                            user: 'root',
                            password: '<password>',
                            database: '<sql-database-name>'});

const mongoEngpoint = "mongodb://<container-name>:27017/<database-name>?authSource=admin";
const port = 5200;

const Order = mongoose.model("Order", OrderSchema)

const app = express();
app.use(express.json());

const connect = () => {
    mongoose.connect(mongoEngpoint);
}

const RequestWrapper = (handler, SchemeAndDbForwarder) => {
    return (req, res) => {
        handler(req, res, SchemeAndDbForwarder)
    }
}

const methodNotAllowed = (req, res, next) => res.status(405).send("Request method not allowed");

// API endpoints for specific customer
app.route("/v1/customer/:customerID/order")
    .get(RequestWrapper(getCustomerOrders, { Order, mysqlConn }))
    .post(RequestWrapper(createNewOrderHandler, { Order }))
    .all(methodNotAllowed);

// API endpoints for a specific order (customer-side) - TODO: Matthew
app.route("/v1/customer/:customerID/order/:orderID")
    .all(methodNotAllowed);

// API endpoints for specific driver
app.route("/v1/driver/:driverID/orderList")
    .get(RequestWrapper(getAssignedOrdersHandlers, { Order, mysqlConn }))
    .all(methodNotAllowed);

app.route("/v1/driver/complete")
    .get(RequestWrapper(getCompletedOrdersHandlers, { Order }))
    .all(methodNotAllowed);

app.route("/v1/driver/earnings")
    .get(RequestWrapper(getTotalEarnings, { Order }))
    .all(methodNotAllowed);

// API endpoints for a specific order (driver-side)
app.route("/v1/driver/accept/:orderID")
    .patch(RequestWrapper(acceptOrderHandler, { Order }))
    .all(methodNotAllowed);

app.route("/v1/driver/complete/:orderID")
    .patch(RequestWrapper(completeOrderHandler, { Order }))
    .all(methodNotAllowed);


connect();
mongoose.connection.on('error', console.error)
    .on('disconnected', connect)
    .once('open', main);

async function main() {
    app.listen(port, "", () => {
        console.log(`server listening on ${port}`);
    });
}