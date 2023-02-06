const express = require('express')
const route = express.Router()
const app = express()
const cors = require('cors')
const { allowCrossDomain } = require('../utils/corsMiddleware')

const ProductsController = require('../controllers/products')

app.use(cors({ origin: '*', credentials: true}))
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
        )
        next()
    })
    
route.post('/api/products/create', ProductsController.createProduct)
route.get('/api/products/getAllProducts', ProductsController.getAllProducts)
route.get('/api/products/getProductById/:productId', ProductsController.getProductById)
route.delete('/api/products/deleteProductById/:productId', ProductsController.deleteProductById)
route.patch('/api/products/editProduct/:productId', ProductsController.editProduct)


module.exports = route



