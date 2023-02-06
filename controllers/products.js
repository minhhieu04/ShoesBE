const { response } = require('express')
const { get } = require('mongoose')
const Products = require('../models/products')
const ProductValidation = require('../helpers/validation')


//CRUD
// CREATE - POST
const createProduct = async (req, res, next) => {
    try {
        // const abc = ProductValidation.addProductsSchema
        // const { 
        //     productName, productBrand, type, price, quantity, images, 
        // } = req.body
        // if (
        //     !productName || 
        //     !productBrand ||
        //     !type || 
        //     !price ||
        //     !quantity || 
        //     !images
        // ) {
        //     res.status(400).json({ 
        //         statusCode: 400, 
        //         message: 'Some fields are not empty.',
        //     })
        // }
        const validBodyReq = await ProductValidation.addProductSchema.validateAsync(req.body)
        // let product = new Products(req.body) 
        let product = new Products(validBodyReq) 
        // product.save()
        // res.status(201).json({
        //     statusCode: 201,
        //     massage: 'Created product is successfully'
        // })
        product.save().then((response) => {
            res.json({
                massage: 'Created product is successfully!.'
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
const getAllProducts = async (req, res, next) => {
    try {
        const {
            pageSize = 12,
            pageNumber = 1,
            productName = '',
            productBrand = '',
            orderByColumn,
            orderByDirection = 'desc',
        } = req.query
        const filter = {
            $and: [
                {
                    productName: {
                        $regex: productName,
                        $options: '$i',
                    },
                },
                {
                    productBrand: {
                        $regex: productBrand,
                        $options: '$i',
                    },
                },
            ],
        }
        const filterProducts = await Products.find(filter)
        .sort(`${orderByDirection === 'asc' ? '' : '-'}${orderByColumn}`)
        .limit(pageSize * 1)
        .skip((pageNumber - 1) * pageSize)

        const allProducts = await Products.find(filter)
        let totalPage = 0
        if (allProducts.length % pageSize === 0) {
            totalPage = allProducts.length / pageSize
        } else {
            totalPage = parseInt(allProducts.length / pageSize) + 1
        }

        if (allProducts.length > 0) {
            res.status(200).json({
                totalPage: totalPage,
                totalProducts: allProducts.length,
                products:
                    orderByDirection && orderByColumn 
                        ? filterProducts
                        : filterProducts.reverse()
            })
        } else {
            res.status(200).json({
                massage: 'No results',
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