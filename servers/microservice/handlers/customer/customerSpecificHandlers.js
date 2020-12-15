var distance = require('google-distance-matrix');
const Constants = require('../../constants/constants');

// Handles the GET request for customer orders
const getCustomerOrders = async (req, res, { Order, mysqlConn }) => {
    let authUser = JSON.parse(req.get(Constants.HTTP_X_USER));
    if (!authUser) {
        res.status(Constants.HTTP_C_Unauthorized).send(Constants.HTTP_M_Unauthorized)
        return;
    }
    
    var userID = authUser.id;
    var customerID = req.params.customerID;
    
    const sqlQuery = 'SELECT usertype FROM Users WHERE id = ' + userID;
    const rows = await mysqlConn.query(sqlQuery);
    if (rows.length == 0) {
        res.status(Constants.HTTP_C_NotFound).send(Constants.HTTP_M_CustomerNotFound);
        return;
    }

    try {
        const orders = await Order.find( { customerID: userID });
        res.setHeader(Constants.HTTP_CONTENT_TYPE, Constants.HTTP_CONTENT_TYPE_JSON);
        res.json(orders);
    } catch (e) {
        res.status(Constants.HTTP_C_InternalServerError).send(Constants.HTTP_M_InternalServerError);
        return;
    }
}

// Handles POST request for creating a new customer order
const createNewOrderHandler = async (req, res, { Order }) => {
    let authUser = JSON.parse(req.get(Constants.HTTP_X_USER));
    if (!authUser) {
        res.status(Constants.HTTP_C_Unauthorized).send(Constants.HTTP_M_Unauthorized)
        return;
    }

    var customerID = authUser.id;
    const driverID = -1;
    const { pickupLocation, dropoffLocation } = req.body;
    const createdAt = new Date();
    const editedAt = new Date();
    const status = Constants.ORDER_SUBMITTED;

    if (!pickupLocation) {
        res.status(Constants.HTTP_C_BadRequest).send(Constants.HTTP_M_InvalidPickupLocation);
        return;
    }
    if (!dropoffLocation) {
        res.status(Constants.HTTP_C_BadRequest).send(Constants.HTTP_M_InvalidDropoffLocation);
        return;
    }

    // Google Distance Matrix API
    var origins = new Array(pickupLocation);
    var destinations = new Array(dropoffLocation);
    distance.key(Constants.GOOGLE_API_KEY);
    distance.units(Constants.DISTANCE_UNITS);
    const computeDistance = (origins, destinations) => {
        return new Promise((resolve, reject) => {
            distance.matrix(origins, destinations, function (err, distances) {
                return err ? reject(err) : resolve(distances.rows[0].elements[0].distance.text);
            })
        })
    }

    const googleResponse = await computeDistance(origins, destinations);
    var dist = googleResponse.split(" ");
    var range = parseFloat(dist[0]);
    var price = Constants.BASE_PRICE * range;

    const newOrder = {
        driverID,
        customerID,
        createdAt,
        status,
        price,
        range,
        pickupLocation,
        dropoffLocation,
        editedAt
    };

    const query = new Order(newOrder);
    query.save((err, createdOrder) => {
        if (err) {
            res.status(Constants.HTTP_C_InternalServerError).send(Constants.HTTP_M_OrderNotCreated);
            return;
        }
        res.setHeader(Constants.HTTP_CONTENT_TYPE, Constants.HTTP_CONTENT_TYPE_JSON);
        res.status(Constants.HTTP_C_Created).send(Constants.HTTP_M_OrderCreated);
    });
}

module.exports = { getCustomerOrders, createNewOrderHandler }