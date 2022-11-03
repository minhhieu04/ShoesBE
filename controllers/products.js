const Products = require('../models/products')


//CRUD
// CREATE - POST
const createProduct = (req, res, next) => {
    try {
        const { 
            productName, productBrand, type, price, discount, quantity, images, 
        } = req.body
        if (
            !productName || 
            !productBrand ||
            !type || 
            !price || 
            !discount || 
            !quantity || 
            !images
        ) {
            res.status(400).json({ 
                statusCode: 400, 
                message: 'Some fields are not empty.',
            })
        }
        let product = new Products(req.body) 
        product.save()
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