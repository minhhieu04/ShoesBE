const { response } = require('express')
const { get } = require('mongoose')
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
        res.status(400).json({
            statusCode: 400,
            message: 'Bad request',
        })
    }
}

// const addProduct = async (req, res, next) => {

// };

// READ - GET || POST

// get all products
const getAllProducts = async (req, res, next) => {
    try {
        const allProducts = await Products.find()
        if (allProducts.length > 0) {
            res.status(200).json({
                products: allProducts.reverse(),
            })
        } else {
            res.status(200).json({
                message: 'No results',
                products: [],
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
const getProductById = async (req, res, next) => {
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

const editProduct = (req, res, next) => {
    try {
        const productId = req.params.productId
        if (!req.body) {
            return res.send({
                statusCode: 404,
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
const deleteProductById = async (req, res, next) => {
    const productId = req.params.productId
    try {
        const product = await Products.findByIdAndRemove(productId)
        if (product) {
            res.status(200).json({
                statusCode: 200,
                massage: 'Deleted product successfully'
            })
        } else {
            res.json({
                statusCode: 204,
                message: 'This product Id have not in the database',
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
module.exports = { createProduct, getAllProducts, getProductById,
     deleteProductById, editProduct }