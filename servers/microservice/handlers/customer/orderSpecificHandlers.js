const Constants = require("../../constants/constants");

// Handles GET request for customer to get order information
const getOrderInformation = async (req, res, { Order }) => {
    // Check user
    const authUser = JSON.parse(req.get(Constants.HTTP_X_USER));
    if (!authUser) {
        res.status(Constants.HTTP_C_Unauthorized).send(Constants.HTTP_M_Unauthorized)
        return
    }

    // Get params
    const customerID = authUser.id
    const orderID = req.params.orderID

    // Get Order
    try {
        await Order.findById(orderID, function (err, order) {
            if (err) {
                res.status(Constants.HTTP_C_NotFound).send(Constants.HTTP_M_OrderNotFound)
                return
            }
            res.status(Constants.HTTP_C_OK).json(order)
        })
    } catch (e) {
        res.status(Constants.HTTP_C_InternalServerError).send(Constants.HTTP_M_InternalServerError)
    }
}

// Handles UPDATE request for customer on given order
// Customer can only delete and order if order status is "submitted"
// Order status will be changed to "cancelled"
const updateOrderInformation = async (req, res, { Order }) => {
    // Check user
    const authUser = JSON.parse(req.get(Constants.HTTP_X_USER));
    if (!authUser) {
        res.status(Constants.HTTP_C_Unauthorized).send(Constants.HTTP_M_Unauthorized)
        return
    }

    // Get params
    const customerID = req.params.customerID
    const orderID = req.params.orderID

    // Update order
    try {
        // Check order status
        await Order.findById(orderID, function (err, order) {
            if (err) {
                res.status(Constants.HTTP_C_NotFound).send(Constants.HTTP_M_OrderNotFound)
                return
            }
            if (order.status !== Constants.ORDER_SUBMITTED) {
                res.status(Constants.HTTP_C_BadRequest).send(Constants.HTTP_M_OrderNotCancelled)
                return
            }
            // Update
            Order.findByIdAndUpdate(orderID, {status: Constants.ORDER_CANCELLED, editedAt: new Date()}, {new: true}, function (err, newOrder) {
                if (err) {
                    res.status(Constants.HTTP_C_InternalServerError).send(Constants.HTTP_M_OrderNotUpdated)
                    return
                }
                res.status(Constants.HTTP_C_OK).json(newOrder)
            })
        })
    } catch (e) {
        res.status(Constants.HTTP_C_InternalServerError).send(Constants.HTTP_M_InternalServerError)
    }
}

module.exports = { getOrderInformation, updateOrderInformation }