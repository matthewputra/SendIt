// JS Modules
const express = require("express");
const mongoose = require("mongoose");
const mysql = require('mysql2/promise');
const { OrderSchema } = require("./schemas/order");

// Constants
var Constants = require("./constants/constants");

// API Handlers
const { getCustomerOrders, 
        createNewOrderHandler } = require("./handlers/customer/customerSpecificHandlers");
const { getAssignedOrdersHandlers, 
        getCompletedOrdersHandlers,
        getAvailableOrdersHandlers,
        getTotalEarnings } = require("./handlers/driver/driverSpecificHandlers");
const { acceptOrderHandler, 
        completeOrderHandler } = require("./handlers/driver/orderSpecificHandlers")
const { getOrderInformation,
        updateOrderInformation } = require("./handlers/customer/orderSpecificHandlers")

var mysqlConn = mysql.createPool({
                            host: Constants.MYSQL_HOST,
                            port: Constants.MYSQL_PORT,
                            user: Constants.MYSQL_USER,
                            password: Constants.MYSQL_PASSWORD,
                            database: Constants.MYSQL_DATABASE});

const mongoEngpoint = Constants.MONGO_ENDPOINT;
const port = Constants.MICROSERVICE_PORT;

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

const methodNotAllowed = (req, res, next) => res.status(Constants.HTTP_C_MethodNotAllowed).send(Constants.HTTP_M_MethodNotAllowed);

// API endpoint for specific customer
app.route(Constants.API_SPECIFIC_CUSTOMER_ORDER)
    .get(RequestWrapper(getCustomerOrders, { Order, mysqlConn }))
    .post(RequestWrapper(createNewOrderHandler, { Order }))
    .all(methodNotAllowed);

// API endpoint for a specific order (customer-side)
app.route(Constants.API_CUSTOMER_SPECIFIC_ORDER)
    .get(RequestWrapper(getOrderInformation, { Order }))
    .patch(RequestWrapper(updateOrderInformation, { Order }))
    .all(methodNotAllowed);

// API endpoint for specific driver
app.route(Constants.API_SPECIFIC_DRIVER_ORDER_LIST)
    .get(RequestWrapper(getAssignedOrdersHandlers, { Order, mysqlConn }))
    .all(methodNotAllowed);

// API endpoint for available orders for driver
app.route(Constants.API_DRIVER_AVAILABLE_ORDERS)
    .get(RequestWrapper(getAvailableOrdersHandlers, { Order }))
    .all(methodNotAllowed);

// API endpoint for driver's completed orders
app.route(Constants.API_SPECIFIC_DRIVER_COMPLETED_ORDERS)
    .get(RequestWrapper(getCompletedOrdersHandlers, { Order }))
    .all(methodNotAllowed);

// API endpoint for driver's earnings
app.route(Constants.API_SPECIFIC_DRIVER_EARNINGS)
    .get(RequestWrapper(getTotalEarnings, { Order }))
    .all(methodNotAllowed);

// API endpoint for accepting specific order (driver-side)
app.route(Constants.API_DRIVER_ACCEPT_SPECIFIC_ORDER)
    .patch(RequestWrapper(acceptOrderHandler, { Order }))
    .all(methodNotAllowed);

// API endpoint for completing specific order (driver-side)
app.route(Constants.API_DRIVER_COMPLETE_SPECIFIC_ORDER)
    .patch(RequestWrapper(completeOrderHandler, { Order }))
    .all(methodNotAllowed);


connect();
mongoose.connection.on(Constants.MONGOOSE_EVENT_ERROR, console.error)
    .on(Constants.MONGOOSE_EVENT_DISCONNECT, connect)
    .once(Constants.MONGOOSE_EVENT_OPEN, main);

async function main() {
    app.listen(port, "", () => {
        console.log(`server listening on ${port}`);
    });
}