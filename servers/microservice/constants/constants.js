
module.exports = {
    // MySQL Constants
    MYSQL_HOST: 'mysqlContainer',
    MYSQL_PORT: '3306',
    MYSQL_USER: 'root',
    MYSQL_PASSWORD: 'serversidedb',
    MYSQL_DATABASE: 'sendItMySqlDB',

    // MongoDB Constants
    MONGO_CONTAINER: 'mongoContainer',  // for reference - change the same value in MONGO_ENDPOINT
    MONGO_DATABASE: 'sendItMongo',      // for reference - change the same value in MONGO_ENDPOINT
    MONGO_ENDPOINT: 'mongodb://mongoContainer:27017/sendItMongo?authSource=admin',

    // Microservice Port
    MICROSERVICE_PORT: 5200,

    // HTTP Status Codes
    HTTP_C_OK: 200,
    HTTP_C_Created: 201,
    HTTP_C_BadRequest: 400,
    HTTP_C_Unauthorized: 401,
    HTTP_C_NotFound: 404,
    HTTP_C_MethodNotAllowed: 405,
    HTTP_C_InternalServerError: 500,
    

    // HTTP Status Messages
    // 201
    HTTP_M_OrderCreated: 'Order successfully submitted',
    // 400
    HTTP_M_InvalidPickupLocation: 'Please provide a valid pickup location',
    HTTP_M_InvalidDropoffLocation: 'Please provide a valid dropoff location',
    HTTP_M_OrderNotCancelled: "Order already accepted by driver, cannot be cancelled",
    // 401
    HTTP_M_Unauthorized: 'Unauthorized user',
    // 404
    HTTP_M_CustomerNotFound: 'CustomerID not found',
    HTTP_M_DriverNotFound: 'DriverID not found',
    HTTP_M_OrderNotFound: 'Order not found',
    // 405
    HTTP_M_MethodNotAllowed: 'Request method not allowed',
    // 500
    HTTP_M_InternalServerError: 'Internal Server Error',
    HTTP_M_OrderNotCreated: 'Unable to create order!',
    HTTP_M_OrderNotUpdated: 'Order cannot be updated',
    HTTP_M_OrderNotAccepted: 'Order not accepted',
    HTTP_M_OrderNotCompleted: 'Order not completed',

    // HTTP Headers
    HTTP_X_USER: 'X-User',
    HTTP_CONTENT_TYPE: 'Content_Type',
    HTTP_CONTENT_TYPE_JSON: 'application/json',
    HTTP_CONTENT_TYPE_TEXT: 'text/plain',

    // API Endpoints
    API_SPECIFIC_CUSTOMER_ORDER: '/v1/customer/:customerID/order',
    API_CUSTOMER_SPECIFIC_ORDER: '/v1/customer/:customerID/order/:orderID',
    API_SPECIFIC_DRIVER_ORDER_LIST: '/v1/driver/:driverID/orderList',
    API_DRIVER_AVAILABLE_ORDERS: '/v1/driver/available',
    API_SPECIFIC_DRIVER_COMPLETED_ORDERS: '/v1/driver/complete',
    API_SPECIFIC_DRIVER_EARNINGS: '/v1/driver/earnings',
    API_DRIVER_ACCEPT_SPECIFIC_ORDER: '/v1/driver/accept/:orderID',
    API_DRIVER_COMPLETE_SPECIFIC_ORDER: '/v1/driver/complete/:orderID',

    // Google API
    GOOGLE_API_KEY: 'AIzaSyDltJNhQmsfOtQOz9-YzYEPsLpLTcMVgbg',
    DISTANCE_UNITS: 'imperial',
    
    // Other
    BASE_PRICE: 2,
    ORDER_SUBMITTED: 'Submitted',
    ORDER_IN_PROGRESS: 'In Progress',
    ORDER_COMPLETED: 'Completed',
    ORDER_CANCELLED: 'Cancelled',
    MONGOOSE_EVENT_ERROR: 'error',
    MONGOOSE_EVENT_DISCONNECT: 'disconnected',
    MONGOOSE_EVENT_OPEN: 'open'
}