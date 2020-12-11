
// Handles GET request for a specific driver to get assigned orders
const getAssignedOrdersHandlers = async (req, res, { Order }) => {
    let authUser = JSON.parse(req.get("X-User"));
    if (!authUser) {
        res.status(401).send("Unauthorized user")
        return;
    }

    var driverID = req.params.driverID;
    const sqlQuery = 'SELECT email FROM Users WHERE id = ' + driverID;
    const rows = await mysqlConn.query(sqlQuery);
    if (rows.length == 0) {
        res.status(404).send("Driver not found");
        return;
    }

    try {
        const orders = await Order.find( { driverID: driverID });
        incompleteOrders = [];
        for (i = 0; i < orders.length; i++) {
            if (orders[i].status != "Completed" && orders[i].driverID != -1) {
                incompleteOrders.push(orders[i]);
            }
        }
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(incompleteOrders);
    } catch (e) {
        res.status(500).send("Internal Server Error - " + e);
        return;
    }
}

// Handles GET request for a specific driver to get completed orders
const getCompletedOrdersHandlers = async (req, res, { Order }) => {
    let authUser = JSON.parse(req.get("X-User"));
    if (!authUser) {
        res.status(401).send("Unauthorized user")
        return;
    }

    var driverID = authUser.id;

    try {
        const completedOrders = await Order.find( { driverID: driverID, status: "Completed" });
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(completedOrders);
    } catch (e) {
        res.status(500).send("Internal Server Error - " + e);
        return;
    }
}