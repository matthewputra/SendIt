
const acceptOrderHandler = async (req, res, { Order }) => {
    let authUser = JSON.parse(req.get("X-User"));
    if (!authUser) {
        res.status(401).send("Unauthorized user")
        return;
    }

    var driverID = authUser.id;
    
    const orderID = req.params.orderID;
    const orderExist = await Order.exists({ _id: orderID });
    if (!orderExist) {
        res.status(404).send("Order not found");
        return;
    }

    try {
        var filter = { _id: orderID };
        var updates = { driverID: driverID, editedAt: new Date(), status: "In progress" };
        await Order.updateOne(filter, updates, function(err) {
            if (err) {
                res.status(500).send("Order could not be accepted");
                return;
            }
        });
        const acceptedOrder = await Order.findById(orderID);
        res.setHeader("Content-Type", "application/json");
        res.json(acceptedOrder);
    } catch (e) {
        res.status(500).send("Internal Server Error - " + e);
        return;
    }
}