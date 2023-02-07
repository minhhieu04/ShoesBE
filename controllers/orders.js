const Orders = require('../models/orders')
const Products = require('../models/products')
const Users = require('../models/users')
const Carts = require('../models/carts')
const errorFunction = require('../utils/errorFunction');
const orderValidation = require('../helpers/orderValidation');


//CREATE OLD

const createOrder = async (req, res, next) => {
    try {
      const productId = await Products.findById(req.body.productId)
      const userId = await Users.findById(req.body.userId)
      if (!userId) {
        return res.json(
          errorFunction(true, 204, 'This user Id have not in the database'),
        )
      }
      if (!productId) {
        return res.json(
          errorFunction(true, 204, 'This product Id have not in the database'),
        )
      }
      const newOrder = await Orders.create(req.body)
      if (newOrder) {
        res.status(201)
        return res.json(errorFunction(false, 201, 'Order Created', newOrder))
      } else {
        res.status(403)
        return res.json(errorFunction(true, 403, 'Error Creating Order'))
      }
    } catch (error) {
      res.status(400)
      return res.json(errorFunction(true, 400, 'Bad request'))
    }
}

// NEW
// ADD ORDER AND CHECK IN STOCK
const addOrderProduct = async (req, res, next) => {
    // get userId from body request
    // get user by userId and check in Database
    // If - ELSE
    // get productId form body request
    // get product by productId and check in Database
    // If - ELSE
    // 
    // if(product)-> check quantity of this product(ex: 10)
    // if quantity of body request(ex: 2) <= quantity of this product in stock quantity -> ok
    // Update quantity of product in stock(10 - 2 = 8)
    // else -> show message

    // REMOVE PRODUCT IN CART IF USER BUY FROM HIS CART
    try {
        const quantity = req.body.quantity
        const user = await Users.findById(req.body.userId)
        const product = await Products.findById(req.body.productId) // result object
        const requestProduct = { quantity: product.quantity - quantity }
        // CHECK IS THIS PRODUCT FROM CART?
        const isProductFromCart = req.body?.cartId
        const cartId = req.body?.cartId
        // remove carrId in body request if want
        // delete req.body?.cartId
        if (!user) {
            return res.json(
                errorFunction(true, 204, 'This user Id have not in the database'),
            )
        }
        if (!product) {
            return res.json(
                errorFunction(true, 204, 'This product Id have not in the database'),
            )
        } else {
            // check quantity
            if (quantity <= product.quantity) {
                // ADD ORDER
                const newOrder = await Orders.create(req.body)
                if (newOrder) {
                    // UPDATE PRODUCT
                    Products.findByIdAndUpdate(req.body.productId, requestProduct)
                    .then((data) => {
                        if (data) {
                            // REMOVE PRODUCT IN CART
                            // if(isProductFromCart) {
                            //  deleteProductByIdInCart(cartId)
                            // }
                            res.status(201)
                            return res.json(
                                errorFunction(false, 201, 'Order Created', newOrder)
                            )
                        } else {
                            return res.json(errorFunction(true, 400, 'Bad request'))
                        }
                    })
                    // REMOVE PRODUCT IN CART
                    if(isProductFromCart) {
                        await deleteProductByIdInCart(cartId)
                    }
                } else {
                    res.status(403)
                    return res.json(errorFunction(true, 403, 'Error Creating Order'))
                }
            } else {
                // Show message
                return res.json(errorFunction(true, 206,
                     'The quantity is greater than quantity in the stock'),)
            }
        }
    } catch (error) {
        res.status(400)
        return res.json(errorFunction(true, 400, 'Bad request'))
    }
}

// ADD MULTIPLE ORDERS
const addMultipleOrders = async (req, res, next) => {
    try {
        const items = req.body.map((item)=> new Orders(item))
        Promise.all(
            items.map((item)=> {
                if (item?.cartId) {
                    deleteProductByIdInCart(item?.cartId)
                    // Carts.findByIdAndRemove(item?.cartId)
                }
                item.save()
                //Orders.create(item)
            }),
        )
        .then((result) => {
            res.status(200)
            return res.json(errorFunction(false, 201, 'Order Created'))
        })
        .catch((error) => {
            res.status(400)
            return res.json(errorFunction(true, 400, 'Bad request'))
        })
    } catch (error) {
        res.status(400)
        return res.json(errorFunction(true, 400, 'Bad request'))
    }
}

//READ - GET || POST
//get all orders

const getAllOrders = async (req, res, next) => {
    try {
        const {
            pageSize = 12,
            pageNumber = 1,
            productName = '',
            productBrand = '',
            orderStatus,
            type = '',
            orderByColumn,
            orderByDirection = 'desc',
        } = req.query
        // const ordersStatusFilter = orderStatus 
        // ? {
        //     orderStatus: orderStatus,
        // }
        // : {
        //     productName: productName,
        //     $options: '$i'
        // }
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
                {
                    type: {
                        $regex: type,
                        $options: '$i',
                    },
                },
                // ordersStatusFilter,
            ],
        }
        const filterOrders = await Orders.find(filter)
        .sort(`${orderByDirection === 'asc' ? '' : '-'}${orderByColumn}`)
        .limit(pageSize * 1)
        .skip((pageNumber - 1) * pageSize)

        const allOrders = await Orders.find(filter)
        let totalPage = 0
        if (allOrders.length % pageSize === 0) {
            totalPage = allOrders.length / pageSize
        } else {
            totalPage = parseInt(allOrders.length / pageSize) + 1
        }

        if (allOrders.length > 0) {
            res.status(200).json({
                totalPage: totalPage,
                totalOrders: allOrders.length,
                orders:
                    orderByDirection && orderByColumn 
                        ? filterOrders
                        : filterOrders.reverse()
            })
        } else {
            res.status(200).json({
                statusCode: 200,
                massage: 'No results',
                orders: [],
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
const getOrderById = async (req, res, next) => {
    const orderId = req.params.orderId
    try {
      const order = await Orders.findById(orderId)
      if (order) {
        res.status(200).json({
          statusCode: 200,
          order,
        })
      } else {
        res.json({
          statusCode: 204,
          message: 'This order Id have not in the database',
          order: {},
        })
      }
    } catch (error) {
      res.status(400)
      return res.json(errorFunction(true, 400, 'Bad request'))
    }
}

//get orders by user id
const getOrdersByUserId = async (req, res, next) => {
    const userId = req.params.userId
    try {
      const filter = {
        $and: [
          {
            userId: {
              $regex: userId,
              $options: '$i',
            },
          },
        ],
      }
      const oders = await Orders.find(filter)
      if (oders) {
        res.status(200).json({
          statusCode: 200,
          total: oders.length,
          carts: oders.reverse(),
        })
      } else {
        return res.json(
          errorFunction(true, 204, 'This order Id have not in the database'),
        )
      }
    } catch (error) {
      res.status(400)
      return res.json(errorFunction(true, 400, 'Bad request'))
    }
  }

//UPDATE - PUT || PATCH
const editOrder = (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const isBodyEmpty = Object.keys(req.body).length;
        if (isBodyEmpty === 0) {
            return res.json(errorFunction(true, 404, 'Body request can not empty.'))
        }
        Orders.findByIdAndUpdate(orderId, req.body).then((data) => {
            if (data) {
                res.status(200).json({
                    statusCode: 200,
                    message: 'Updated order successfully',
                })
            } else {
                res.json({
                    statusCode: 204,
                    message: 'This order Id have not in the database ',
                })
            }
        })
    } catch (error) {
        res.status(400)
        return res.json(errorFunction(true, 400, 'Bad request'))
    }
}

//DELETE - DELETE ORDER BY ID
const deleteOrderById = async (req, res, next) => {
    const orderId = req.params.orderId
    try {
      const order = await Orders.findByIdAndRemove(orderId)
      if (order) {
        res.status(200).json({
          statusCode: 200,
          message: 'Deleted order successfully',
        })
      } else {
        res.json({
          statusCode: 204,
          message: 'This order Id have not in the database',
        })
      }
    } catch (error) {
      res.status(400)
      return res.json(errorFunction(true, 400, 'Bad request'))
    }
}

const deleteProductByIdInCart = async (cartId) => {
    try {
        await Carts.findByIdAndRemove(cartId)
    } catch (error) {
        console.log('error')
        return null
    }
}

module.exports = { 
    createOrder,
    addOrderProduct,
    addMultipleOrders,
    getAllOrders,
    getOrderById,
    getOrdersByUserId,
    editOrder,
    deleteOrderById,
}