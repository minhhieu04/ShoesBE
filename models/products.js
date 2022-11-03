const mongoose = require('mongoose');
const Schema = mongoose.Schema

const productsSchema = new Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        productBrand: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        info: {
            type: String,
            required: false,
        },
        price: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        images: {
            type: Object,
            required: true,
        },

    },   
    { timestamps: true }
)

const Products = mongoose.model('Products', productsSchema)
module.exports = Products
