const Schema = require('mongoose').Schema
// Data type to store decimals up to 2 numbers behind ','
const Float = require('mongoose-float').loadType(mongoose);

const orderSchema = new Schema({
    driverID: {type: String}, // order can be assigned to no driver if the status is "submitted"
    customerID: {type: String, required: true},
    createdAt: {type: Date, required: true},
    status: {type: String, required: true}, // "completed", "on progress", "submitted"
    price: {type: Float, required: true},
    range: {type: Float, required: true},
    pickupLocation: {type: String, required: true},
    dropoffLocation: {type: String, required: true}
})

module.exports = { orderSchema }