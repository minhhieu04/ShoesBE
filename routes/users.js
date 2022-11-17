const express = require('express')
const route = express.Router()
const app = express()
const { allowCrossDomain } = require('../utils/corsMiddleware')
const userValidation = require('../helpers/userValidation')


const UsersController = require('../controllers/users')

app.use(allowCrossDomain)

// app.use(cors({ origin: '*', credentials: true}))
// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*')
//     res.header(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept',
//         )
//         next()
//     })
    
route.post('/api/auths/register', userValidation, UsersController.addUser)
route.get('/api/products/getAllUsers', UsersController.getAllUsers)
route.get('/api/products/getProductById/:productId', UsersController.getUserById)
route.delete('/api/products/deleteUserById/:userId', UsersController.deleteUserById)
route.patch('/api/products/editProduct/:productId', UsersController.editUser)


module.exports = route



