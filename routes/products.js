const express = require('express')
const route = express.Router()
const app = express()
const cors = require('cors')

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}


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

module.exports = route



