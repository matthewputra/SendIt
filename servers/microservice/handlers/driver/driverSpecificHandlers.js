
// Handles GET request for a specific driver to get assigned orders
const getAssignedOrdersHandlers = async (req, res, { Order, mysqlConn }) => {
    let authUser = JSON.parse(req.get("X-User"));
    if (!authUser) {
        res.status(401).send("Unauthorized user")
        return;
    }

    var driverID = req.params.driverID;
    const sqlQuery = 'SELECT usertype FROM Users WHERE id = ' + driverID;
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

// Handles GET request for a specific driver to get total earnings
const getTotalEarnings = async (req, res, { Order }) => {
    let authUser = JSON.parse(req.get("X-User"));
    if (!authUser) {
        res.status(401).send("Unauthorized user")
        return;
    }
    
    var driverID = authUser.id;

    try {
        const orders = await Order.find( { driverID: driverID, status: "Completed" });
        totalEarnings = 0;
        for (i = 0; i < orders.length; i++) {
            totalEarnings += orders[i].price;
        }
        res.setHeader("Content-Type", "text/plain");
        res.status(200).send(totalEarnings.toString());
    } catch (e) {
        res.status(500).send("Internal Server Error - " + e);
        return;
    }
}

module.exports = { getAssignedOrdersHandlers, getCompletedOrdersHandlers, getTotalEarnings }