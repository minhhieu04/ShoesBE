const Users = require('../models/users')
const jwt = require('jsonwebtoken')
const UserValidation = require('../helpers/validation')
const errorFunction = require('../utils/errorFunction')
const securePassword = require('../utils/securePassword')
const { response } = require('express')
const bycrypt = require('bcryptjs')
const nodemailer = require("nodemailer");

// CRUD
// CREATE - POST
/* 
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
*/
const register = async (req, res, next) => {
    try {
        const existingEmail = await Users.findOne({
             email: req.body.email 
        }).lean(true)
        const existingUsername = await Users.findOne({
            username: req.body.username
        }).lean(true)
        if (existingEmail || existingUsername) {
            res.status(403)
            return res.json(errorFunction(true, 403, 'User Already Exist'))
        } else {
            const hashedPassword = await securePassword(req.body.password)
            const newUser = await Users.create({
                username: req.body.username,
                password: hashedPassword,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
                email: req.body.email,
                address: req.body.address,
                avatar: req.body.avatar,
                isAdmin: req.body.isAdmin,
            })
            if (newUser) {
                res.status(201)
                return res.json(errorFunction(false, 201, 'User Created', newUser))
            } else {
                res.status(403)
                return res.json(errorFunction(true, 403, 'Error Creating User'))
            }
        }
    } catch (error) {
        res.status(400)
        console.log(error)
        return res.json(errorFunction(true, 400, 'Error Adding User'));
    }
}

const login = (req, res, next) => {
    try {
        var username = req.body.username
        var password = req.body.password

        Users.findOne({ username: username }).then(
            (user) => {
                if (user) {
                    bycrypt.compare(password, user.password, function (err, result) {
                        if (err) {
                            res.json(errorFunction(true, 400, 'Bad request'))
                        }
                        if (result) {
                            let access_token = jwt.sign (
                                { 
                                    username: user.username,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    isAdmin: user.isAdmin,
                                },
                                'secretValue', 
                                { 
                                    expiresIn: '1h'
                                }
                            )
                            res.json({
                                massage: "Login Successfully",
                                access_token,
                                userId: user._id,
                                username: user.username,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                isAdmin: user.isAdmin,
                                phone: user.phone,
                                address: user.address,
                                avatar: user.avatar,
                            })
                        } else {
                            res.json(errorFunction(true, 400, 'Password does not matched'))
                        }
                    })
                } else {
                    res.json(errorFunction(true, 400, 'User not found'))
                }
            },
        )
    } catch (error) {
        res.json(errorFunction(true, 400, 'Bad request'))
    }
}

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
    const userId = req.params.userId
    try {
        const userResult = await Users.findById(userId)
        if (userResult) {
            res.status(200).json({
                statusCode: 200,
                user,
            })
        } else {
            res.json({
                statusCode: 204,
                message: 'This user Id have not in the database',
                user: {},
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

// change password
const changePassword = async (req, res) => {
    // body request
    // user Id - oldPassword - newPassword
    try {
        // get userId to find in Database

        const userId = req.body.userId
        const existingUser = await Users.findById(userId)
        //get user success

        if (!existingUser) {
            res.status(403)
            return res.json(errorFunction(false, 403, 'User is not exist'));
        } else {
            // compare oldPassword vs newPassword in DB
            const encryptedPassword = await bycrypt.compareSync(
                req.body.oldPassword, existingUser.password)
            if (encryptedPassword) {
                // hash new password
                const hashedPassword = await securePassword(req.body.newPassword)

                //body request
                const request = {
                    password: hashedPassword
                }

                Users.findByIdAndUpdate(userId, request, {
                    useFindAndModify: false,
                }).then((data) => {
                    if (!data) {
                        return res.json(errorFunction(false, 404, 'Bad request'));
                    } else {
                        res.status(200)
                        return res.json(errorFunction(true, 200, "Updated user's password successfully!"))
                    }
                })
            } else {
                res.status(403)
                return res.json(errorFunction(false,403, 'Password does not match!'))
            }
        }
    } catch (error) {
        res.status(400)
        return res.json(errorFunction(false, 400, 'Bad request'))
    }
}

// Forgot password
const forgotPassword = async (req, res) => {
    try {
        const existingUser = await Users.findOne({
                email: req.body.email,
        }).lean(true)
        if (!existingUser) {
            res.status(403)
            return res.json(errorFunction(false,403, 'User does not exists!'))
        } else {
            // random a new password
            const randomPassword = Math.random().toString(36).slice(2,10)
            // get userId from object user's info
            const userId = existingUser._id.valueOf()
            // hash new password
            const hashedPassword = await securePassword(randomPassword)
            // body request
            const request = {
                password: hashedPassword,
            }

            Users.findByIdAndUpdate(userId, request, {
                useFindAndModify: false,
            }).then((data) => {
                if (!data) {
                    return res.json(errorFunction(false, 404, 'Bad request'))
                } else {
                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                            user: 'minhhieu.tran.mcs@gmail.com',
                            pass: 'tdpjmtakgzobhxby'
                        },
                    })

                    const mailOptions = {
                        from: 'minhhieu.tran.mcs@gmail.com',
                        to: req.body.email,
                        subject: 'Sending Email using Node.js',
                        text: 'That was easy!',
                        html:
                            '<p>This is an automation email from ShoesApp. Your password was updated.</p><ul><li>Username: '
                            + existingUser.username + 
                            '</li><li>Email: '+ existingUser.email +
                            '</li><li>Password: '+ randomPassword +
                            '</li></ul>' + 
                            '<p>Please change your password to protect your information.</p>'
                    }

                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            console.log('error: ', error);
                        } else {
                            console.log('Email sent: ', info.response)
                        }
                    })
                    return res.json(
                        errorFunction(false, 200, "Updated user's password successfully!")
                    )
                }
            })
        }
    } catch (error) {
        res.json(errorFunction(true, 404, "Bad request"))
    }
}

module.exports = { register, login, getAllUsers, getUserById,
     deleteUserById, editUser, changePassword, forgotPassword }