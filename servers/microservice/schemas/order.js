const Schema = require('mongoose').Schema
// Data type to store decimals up to 2 numbers behind ','
// const Float = require('mongoose-float').loadType('mongoose');

const OrderSchema = new Schema({
    driverID: {type: Number}, // order can be assigned to no driver if the status is "submitted"
    customerID: {type: Number, required: true},
    createdAt: {type: Date, required: true},
    status: {type: String, required: true}, // "completed", "on progress", "submitted", "cancelled"
    price: {type: Number, required: true},
    range: {type: Number, required: true},
    pickupLocation: {type: String, required: true},
    dropoffLocation: {type: String, required: true},
    editedAt: {type: Date, required: true}
})

module.exports = { OrderSchema }