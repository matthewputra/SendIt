// Handles GET request for customer to get order information
const getOrderInformation = async (req, res, { Order }) => {
    // Check user
    const authUser = JSON.parse(req.get("X-User"));
    if (!authUser) {
        res.status(401).send("Unauthorized user")
        return
    }

    // Get params
    const customerID = req.params.customerID
    const orderID = req.params.orderID

    // Check given customerID
    if (customerID !== authUser.id) {
        res.status(400).send("invalid customerID")
        return
    }

    // Get Order
    try {
        await Order.findById(orderID, function (err, order) {
            if (err) {
                res.status(404).send("order not found")
                return
            }
            res.status(200).json(order)
        })
    } catch (e) {
        res.status(500).send("internal Server Error - " + e)
    }
}

// Handles UPDATE request for customer on given order
// Customer can only delete and order if order status is "submitted"
// Order status will be changed to "cancelled"
const updateOrderInformation = async (req, res, { Order }) => {
    // Check user
    const authUser = JSON.parse(req.get("X-User"));
    if (!authUser) {
        res.status(401).send("Unauthorized user")
        return
    }

    // Get params
    const customerID = req.params.customerID
    const orderID = req.params.orderID

    // Check given customerID
    if (customerID !== authUser.id) {
        res.status(400).send("invalid customerID")
        return
    }

    // Update order
    try {
        // Check order status
        await Order.findById(orderID, function (err, order) {
            if (err) {
                res.status(404).send("order not found")
                return
            }
            if (order.status !== "submitted") {
                res.status(400).send("order has been accepted by a driver")
                return
            }
            // Update
            Order.findByIdAndUpdate(orderID, {status: "cancelled", editedAt: new Date()}, {new: true}, function (err, newOrder) {
                if (err) {
                    res.status(500).send('unable to update order')
                    return
                }
                res.status(200).json(newOrder)
            })
        })
    } catch (e) {
        res.status(500).send("internal Server Error - " + e)
    }
}

module.exports = { getOrderInformation, updateOrderInformation }