const mongoose = require('mongoose')

const Carts = mongoose.model(
    'Carts',
    new mongoose.Schema(
        {
            productId: {
                type: String,
                require: true,
            },
            productName: {
                type: String,
                require: true,
            },
            productBrand: {
                type: String,
                require: true,
            },
            type: {
                type: String,
                require: true,
            },
            price: {
                type: Number,
                require: true,
            },
            quantity: {
                type: Number,
                require: true,
            },
            image: {
                type: String,
                require: false,
            },
            userId: {
                type: String,
                require: true,
            },
        },      
        { timestamps: true },
    )
)

module.exports = Carts