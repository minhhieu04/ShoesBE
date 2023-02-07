const express = require('express')
const route = express.Router()
const app = express()
const { allowCrossDomain } = require('../utils/corsMiddleware')
const orderValidation = require('../helpers/orderValidation')

const OrdersController = require('../controllers/orders')

app.use(allowCrossDomain)

route.post('/api/orders/createOrders',orderValidation, OrdersController.addOrderProduct)
route.post('/api/orders/addMultipleOrders', OrdersController.addMultipleOrders)


route.get('/api/orders/getAllOrders', OrdersController.getAllOrders)
route.get('/api/orders/getOrderById/:orderId', OrdersController.getOrderById)
route.get('/api/orders/getOrdersByUserId/:userId', OrdersController.getOrdersByUserId)

route.delete('/api/orders/deleteOrderById/:orderId', OrdersController.deleteOrderById)

route.patch('/api/oders/editOrderById/:orderId', OrdersController.editOrder)

module.exports = route