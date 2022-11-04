const Products = require('../models/products')


//CRUD
// CREATE - POST
const createProduct = (req, res, next) => {
    try {
        const { 
            productName, productBrand, type, price, quantity, images, 
        } = req.body
        if (
            !productName || 
            !productBrand ||
            !type || 
            !price ||
            !quantity || 
            !images
        ) {
            res.status(400).json({ 
                statusCode: 400, 
                message: 'Some fields are not empty.',
            })
        }
        let product = new Products(req.body) 
        // product.save()
        // res.status(201).json({
        //     statusCode: 201,
        //     massage: 'Created product is successfully'
        // })
        product.save().then((response) => {
            res.json({
                massage: 'Created product is successfully'
            })
        })

        
    } catch (error) {
        console.log(error);
    }
}

// const addProduct = async (req, res, next) => {

// };

// READ - GET || POST
// UPDATE - PUT || PATCH
// DELETE - DELETE

module.exports = { createProduct }