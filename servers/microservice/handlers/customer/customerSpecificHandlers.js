
// Handles the GET request for customer orders
const getCustomerOrders = async (req, res, { Order }) => {
    let authUser = JSON.parse(req.get("X-User"));
    if (!authUser) {
        res.status(401).send("Unauthorized user")
        return;
    }
    
    var userID = authUser.id;
    var customerID = req.params.customerID;
    
    const sqlQuery = 'SELECT usertype FROM Users WHERE id = ' + customerID;
    const rows = await mysqlConn.query(sqlQuery);
    if (rows.length == 0) {
        res.status(404).send("CustomerID not found");
        return;
    }

    try {
        const orders = await Order.find( { customerID: userID });
        res.setHeader("Content-Type", "application/json");
        res.json(orders);
    } catch (e) {
        res.status(500).send("Internal Server Error - " + e);
        return;
    }
}

// Handles POST request for creating a new customer order
const createNewOrderHandler = async (req, res, { Order }) => {
    let authUser = JSON.parse(req.get("X-User"));
    if (!authUser) {
        res.status(401).send("Unauthorized user")
        return;
    }

    var userID = authUser.id;
    
    const driverID = -1;
    const { price, range, pickupLocation, dropoffLocation } = req.body;
    const createdAt = new Date();
    const status = "submitted";

    if (!pickupLocation) {
        res.status(400).send("Please provide a valid pickup location");
        return;
    }
    if (!dropoffLocation) {
        res.status(400).send("Please provide a valid dropoff location");
        return;
    }

    const newOrder = {
        driverID,
        userID,
        createdAt,
        status,
        price,
        range,
        pickupLocation,
        dropoffLocation
    };

    const query = new Order(newOrder);
    query.save((err, createdOrder) => {
        if (err) {
            res.status(500).send("Unable to create order!");
            return;
        }
        res.setHeader("Content-Type", "application/json");
        res.status(201).send("Order successfully submitted");
    });
}