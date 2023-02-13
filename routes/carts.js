const express = require('express')
const route = express.Router()
const app = express()
const { allowCrossDomain } = require('../utils/corsMiddleware')
const cartValidation = require('../helpers/cartValidation')

const CartsController = require('../controllers/carts')

app.use(allowCrossDomain)

route.post('/api/carts/createCart',cartValidation, CartsController.createCarts)

route.get('/api/carts/getAllCarts', CartsController.getAllCarts)
route.get('/api/carts/getCartById/:cartId', CartsController.getCartById)
route.get('/api/carts/getCartsByUserId/:userId', CartsController.getCartByUserId)

route.delete('/api/carts/deleteCartById/:cartId', CartsController.deleteCartById)
route.delete('/api/carts/deleteMultipleCarts', CartsController.deleteMultipleCarts)

route.patch('/api/carts/editCart/:cartId', CartsController.editCart)

module.exports = route