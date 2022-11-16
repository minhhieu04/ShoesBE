const Users = require('../models/users')
const UserValidation = require('../helpers/validation')

// CRUD
// CREATE - POST
const createUser = async (req, res, next) => {
    try {
        const validBodyReq = await UserValidation.addUserSchema.validateAsync(req.body)
        // let product = new Products(req.body) 
        let user = new Users(validBodyReq) 
        user.save().then((response) => {
            res.json({
                massage: 'Created user is successfully!.'
            })
        }) 
    } catch (error) {
        // console.log(error);
        console.log("ERROR: ", error)
        // res.status(400).json({
        //     statusCode: 400,
        //     message: 'Bad request',
        // })
        return res.status(400).json({
            statusCode: 400,
            massage: 'Bad request',
            errorMassage: error.details[0].message,
        })
    }
}

// const addProduct = async (req, res, next) => {

// };

// READ - GET || POST

// get all products
const getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await Users.find()
        if (allUsers.length > 0) {
            res.status(200).json({
                products: allUsers.reverse(),
            })
        } else {
            res.status(200).json({
                message: 'No results',
                users: [],
            })
        }
    } catch (error) {
        console.log('error', error)
        res.status(400).json({
            message: 'Bad request'
        })
    }
}

// get by id
const getUserById = async (req, res, next) => {
    const productId = req.params.productId
    try {
        const product = await Products.findById(productId)
        if (product) {
            res.status(200).json({
                statusCode: 200,
                product,
            })
        } else {
            res.json({
                statusCode: 204,
                message: 'This product Id have not in the database',
                products: {},
            })
        }
    } catch (error) {
        console.log('error', error)
        res.status(400).json({
            statusCode: 400,
            message: 'Bad request'
        })
    }
}

// UPDATE - PUT || PATCH

const editUser = (req, res, next) => {
    try {
        const productId = req.params.productId
        const isBodyEmpty = Object.keys(req.body).length;
        if (isBodyEmpty === 0) {
            return res.send({
                statusCode: 403,
                massage: 'Body request can not empty!',
            })
        }
        Products.findByIdAndUpdate(productId, req.body).then((data) => {
            if (data) {
                res.status(200).json({
                    statusCode: 200,
                    massage: 'Update product successfully',
                })
            } else {
                res.json({ 
                    statusCode: 204,
                    massage: 'This product Id have not in the database'
                })
            }
        })
    } catch (error) {
        console.log('error', error)
        res.status(400).json({
            statusCode: 400,
            message: 'Bad request'
        })
    }
}
// DELETE - DELETE

//delete product by Id
const deleteUserById = async (req, res, next) => {
    const userId = req.params.userId
    try {
        const user = await Users.findByIdAndRemove(userId)
        if (user) {
            res.status(200).json({
                statusCode: 200,
                massage: 'Deleted user successfully'
            })
        } else {
            res.json({
                statusCode: 204,
                message: 'This user Id have not in the database',
            })
        }
    } catch (error) {
        console.log('error', error)
        res.status(400).json({
            statusCode: 400,
            message: 'Bad request'
        })
    }
}
module.exports = { createUser, getAllUsers, getUserById,
     deleteUserById, editUser }