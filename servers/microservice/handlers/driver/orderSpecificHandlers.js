const Constants = require("../../constants/constants");

// Handles PATCH request to accept an order by a specific driver
const acceptOrderHandler = async (req, res, { Order }) => {
    let authUser = JSON.parse(req.get(Constants.HTTP_X_USER));
    if (!authUser) {
        res.status(Constants.HTTP_C_Unauthorized).send(Constants.HTTP_M_Unauthorized)
        return;
    }

    var driverID = authUser.id;
    const orderID = req.params.orderID;

    const orderExist = await Order.exists({ _id: orderID });
    if (!orderExist) {
        res.status(Constants.HTTP_C_NotFound).send(Constants.HTTP_M_OrderNotFound);
        return;
    }

    try {
        var filter = { _id: orderID };
        var updates = { driverID: driverID, editedAt: new Date(), status: Constants.ORDER_IN_PROGRESS };
        
        await Order.updateOne(filter, updates, function(err) {
            if (err) {
                res.status(Constants.HTTP_C_InternalServerError).send(Constants.HTTP_M_OrderNotAccepted);
                return;
            }
        });

        const acceptedOrder = await Order.findById(orderID);
        res.setHeader(Constants.HTTP_CONTENT_TYPE, Constants.HTTP_CONTENT_TYPE_JSON);
        res.json(acceptedOrder);
    } catch (e) {
        res.status(Constants.HTTP_C_InternalServerError).send(Constants.HTTP_M_InternalServerError);
        return;
    }
}

// Handles PATCH request to complete an order by a specific driver
const completeOrderHandler = async (req, res, { Order }) => {
    let authUser = JSON.parse(req.get(Constants.HTTP_X_USER));
    if (!authUser) {
        res.status(Constants.HTTP_C_Unauthorized).send(Constants.HTTP_M_Unauthorized)
        return;
    }

    var driverID = authUser.id;
    const orderID = req.params.orderID;
    
    const orderExist = await Order.exists({ _id: orderID });
    if (!orderExist) {
        res.status(Constants.HTTP_C_NotFound).send(Constants.HTTP_M_OrderNotFound);
        return;
    }

    try {
        var filter = { _id: orderID, driverID: driverID };
        var updates = { editedAt: new Date(), status: Constants.ORDER_COMPLETED };
        
        await Order.updateOne(filter, updates, function(err) {
            if (err) {
                res.status(Constants.HTTP_C_InternalServerError).send(Constants.HTTP_M_OrderNotCompleted);
                return;
            }
        });
        
        const completedOrder = await Order.findById(orderID);
        res.setHeader(Constants.HTTP_CONTENT_TYPE, Constants.HTTP_CONTENT_TYPE_JSON);
        res.status(Constants.HTTP_C_OK).json(completedOrder);
    } catch (e) {
        res.status(Constants.HTTP_C_InternalServerError).send(Constants.HTTP_M_InternalServerError);
        return;
    }
}

module.exports = { acceptOrderHandler, completeOrderHandler }