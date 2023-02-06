const express = require('express')
const route = express.Router()
const app = express()
const { allowCrossDomain } = require('../utils/corsMiddleware')
const cartValidation = require('../helpers/cartValidation')

const CartsController = require('../controllers/carts')

app.use(allowCrossDomain)

route.post('/api/orders/createCart',cartValidation, CartsController.createCarts)

module.exports = route