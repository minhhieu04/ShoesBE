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


const UsersController = require('../controllers/users')

app.use(cors({ origin: '*', credentials: true}))
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
        )
        next()
    })
    
route.post('/api/users/create', UsersController.createUser)
route.get('/api/products/getAllUsers', UsersController.getAllUsers)
route.get('/api/products/getProductById/:productId', UsersController.getUserById)
route.delete('/api/products/deleteUserById/:userId', UsersController.deleteUserById)
route.patch('/api/products/editProduct/:productId', UsersController.editUser)


module.exports = route



