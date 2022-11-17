const { required } = require("joi")
const Joi = require("joi")
const { errorFunction } = require('../utils/errorFunction')
const securePassword = require("../utils/securePassword")

const patternPassword = /^[a-zA-Z0-9]{3,30}$/
const patternPhoneNumber = /[0]{1}[0-9]{9}/


const validation = Joi.object({
    username: Joi.string().min(5).max(30).required(),
    password: Joi.string().pattern(new RegExp(patternPassword)).required(),
    firstName: Joi.string().min(2).max(100).required(),
    lastName: Joi.string().min(2).max(100).required(),
    phone: Joi.string().length(10)
    .pattern(new RegExp(patternPhoneNumber)).required(),
    email: Joi.string().email({ tlds: { allow: true}}).allow(""),
    address: Joi.string().min(10).max(200).allow(""),
    avatar: Joi.string().allow(""),
    isAdmin: Joi.boolean().required(),
})

const userValidation = async (req, res, next) => {
    const payload = {
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        avatar: req.body.avatar,
        isAdmin: req.body.isAdmin,
    }
    
    const { error } = validation.validate(req.body)
    if(error) {
        res.status(406)
        return res.json(
            errorFunction(true, `Error in User Data: ${error.message}`),
        )
    } else {
        next()
    }
}

module.exports = userValidation
