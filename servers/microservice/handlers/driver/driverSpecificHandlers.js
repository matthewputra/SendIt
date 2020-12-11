
// Handles GET request for a specific driver
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