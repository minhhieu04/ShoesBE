const Joi = require("joi")
const errorFunction = require('../utils/errorFunction')

const validation = Joi.object({
    productId: Joi.string().required(),
    productName: Joi.string().min(4).max(100).required(),
    productBrand: Joi.string().max(100).required(),
    type: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    image: Joi.string().required(),
    userId: Joi.string().required(),
})

const cartValidation = async (req, res, next) => {
    const { error } = validation.validate(req.body)
    if(error) {
        res.status(406)
        return res.json(
            errorFunction(true, `Error in Order Data: ${error.message}`),
        )
    } else {
        next()
    }
}

module.exports = cartValidation
