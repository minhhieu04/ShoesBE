const mongoose = require('mongoose');
const Schema = mongoose.Schema

const odersSchema = new Schema(
    {
        productId: {
            type: String,
            required: true,
        },
        productName: {
            type: String,
            required: true,
        },
        productBrand: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: false,
        },
        price: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        orderStatus: {
            type: Number,
            required: true
        }
    },   
    { timestamps: true }
)

const Orders = mongoose.model('Orders', odersSchema)
module.exports = Orders
