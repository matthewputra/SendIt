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
const { getOrderInformation,
        updateOrderInformation } = require("./handlers/customer/orderSpecificHandlers")

var mysqlConn = mysql.createPool({
                            host: 'mysqlContainer',
                            port: '3306',
                            user: 'root',
                            password: 'serversidedb',
                            database: 'sendItMySqlDB'});

const mongoEngpoint = "mongodb://mongoContainer:27017/sendItMongo?authSource=admin";
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
// app.route("/v1/customer/:customerID/order")
app.get("/v1/customer/:customerID/order", RequestWrapper(getCustomerOrders, { Order, mysqlConn }))
app.post("/v1/customer/:customerID/order", RequestWrapper(createNewOrderHandler, { Order }))
app.all("/v1/customer/:customerID/order", methodNotAllowed);

// API endpoints for a specific order (customer-side)
app.route("/v1/customer/:customerID/order/:orderID")
    .get(RequestWrapper(getOrderInformation, { Order }))
    .patch(RequestWrapper(updateOrderInformation, { Order }))
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