const Constants = require("../../constants/constants");

// Handles GET request for a specific driver to get assigned orders
const getAssignedOrdersHandlers = async (req, res, { Order, mysqlConn }) => {
    let authUser = JSON.parse(req.get(Constants.HTTP_X_USER));
    if (!authUser) {
        res.status(Constants.HTTP_C_Unauthorized).send(Constants.HTTP_M_Unauthorized)
        return;
    }

    var driverID = req.params.driverID;
    const sqlQuery = 'SELECT usertype FROM Users WHERE id = ' + driverID;
    const rows = await mysqlConn.query(sqlQuery);
    if (rows.length == 0) {
        res.status(Constants.HTTP_C_NotFound).send(Constants.HTTP_M_DriverNotFound);
        return;
    }

    try {
        const orders = await Order.find( { driverID: driverID });
        incompleteOrders = [];
        for (i = 0; i < orders.length; i++) {
            if (orders[i].status != Constants.ORDER_COMPLETED && orders[i].driverID != -1) {
                incompleteOrders.push(orders[i]);
            }
        }
        res.setHeader(Constants.HTTP_CONTENT_TYPE, Constants.HTTP_CONTENT_TYPE_JSON);
        res.status(Constants.HTTP_C_OK).json(incompleteOrders);
    } catch (e) {
        res.status(Constants.HTTP_C_InternalServerError).send(Constants.HTTP_M_InternalServerError);
        return;
    }
}

// Handles GET request for a specific driver to get completed orders
const getCompletedOrdersHandlers = async (req, res, { Order }) => {
    let authUser = JSON.parse(req.get(Constants.HTTP_X_USER));
    if (!authUser) {
        res.status(Constants.HTTP_C_Unauthorized).send(Constants.HTTP_M_Unauthorized)
        return;
    }

    var driverID = authUser.id;

    try {
        const completedOrders = await Order.find( { driverID: driverID, status: Constants.ORDER_COMPLETED });
        res.setHeader(Constants.HTTP_CONTENT_TYPE, Constants.HTTP_CONTENT_TYPE_JSON);
        res.status(Constants.HTTP_C_OK).json(completedOrders);
    } catch (e) {
        res.status(Constants.HTTP_C_InternalServerError).send(Constants.HTTP_M_InternalServerError);
        return;
    }
}

// Handles GET request for a driver to get available orders
const getAvailableOrdersHandlers = async (req, res, { Order }) => {
    let authUser = JSON.parse(req.get(Constants.HTTP_X_USER));
    if (!authUser) {
        res.status(Constants.HTTP_C_Unauthorized).send(Constants.HTTP_M_Unauthorized)
        return;
    }

    try {
        const completedOrders = await Order.find( { status: Constants.ORDER_SUBMITTED });
        res.setHeader(Constants.HTTP_CONTENT_TYPE, Constants.HTTP_CONTENT_TYPE_JSON);
        res.status(Constants.HTTP_C_OK).json(completedOrders);
    } catch (e) {
        res.status(Constants.HTTP_C_InternalServerError).send(Constants.HTTP_M_InternalServerError);
    }
}

// Handles GET request for a specific driver to get total earnings
const getTotalEarnings = async (req, res, { Order }) => {
    console.log(req.get(Constants.HTTP_X_USER))
    let authUser = JSON.parse(req.get(Constants.HTTP_X_USER));
    if (!authUser) {
        res.status(Constants.HTTP_C_Unauthorized).send(Constants.HTTP_M_Unauthorized)
        return;
    }
    
    var driverID = authUser.id;

    try {
        const orders = await Order.find( { driverID: driverID, status: Constants.ORDER_COMPLETED });
        totalEarnings = 0;
        for (i = 0; i < orders.length; i++) {
            totalEarnings += orders[i].price;
        }
        res.setHeader(Constants.HTTP_CONTENT_TYPE, Constants.HTTP_CONTENT_TYPE_TEXT);
        res.status(Constants.HTTP_C_OK).send(totalEarnings.toString());
    } catch (e) {
        res.status(Constants.HTTP_C_InternalServerError).send(Constants.HTTP_M_InternalServerError);
        return;
    }
}

module.exports = { getAssignedOrdersHandlers, getCompletedOrdersHandlers, getAvailableOrdersHandlers ,getTotalEarnings }