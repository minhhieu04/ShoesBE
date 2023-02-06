const express = require('express')
const route = express.Router()
const app = express()
const { allowCrossDomain } = require('../utils/corsMiddleware')
const orderValidation = require('../helpers/orderValidation')

const OrdersController = require('../controllers/orders')

app.use(allowCrossDomain)

route.post('/api/orders/createOrders',orderValidation, OrdersController.addOrderProduct)
route.get('/api/orders/getAllOrders', OrdersController.getAllOrders)
route.get('/api/orders/getOrderById/:orderId', OrdersController.getOrderById)

module.exports = route