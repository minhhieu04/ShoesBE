const Carts = require("../models/carts");
const Products = require("../models/products");
const Users = require("../models/users");
const errorFunction = require("../utils/errorFunction");

// Create
const createCarts = async (req, res) => {
  try {
    const productId = await Products.findById(req.body.productId);
    const userId = await Users.findById(req.body.userId);
    if (!userId) {
      return res.json(
        errorFunction(true, 204, "This user Id have not in the database")
      );
    }
    if (!productId) {
      return res.json(
        errorFunction(true, 204, "This product Id have not in the database")
      );
    }
    const newCart = await Carts.create(req.body);
    if (newCart) {
      res.status(201);
      return res.json(errorFunction(false, 201, "Cart Created", newCart));
    } else {
      res.status(403);
      return res.json(errorFunction(true, 403, "Error Creating Cart"));
    }
  } catch (error) {
    res.status(400);
    return res.json(errorFunction(true, 400, "Bad request"));
  }
};

const addCartAndUpdateCart = async (req, res, next) => {
  try {
    const filter = {
      $and: [
        {
          productId: {
            $regex: req.body.productId,
            $options: "$i",
          },
        },
        {
          userId: {
            $regex: req.body.userId,
            $options: "$i",
          },
        },
      ],
    };
    const productId = await Products.findById(req.body.productId);
    const userId = await Users.findById(req.body.userId);
    if (!userId) {
      return res.json(
        errorFunction(true, 204, "This user Id have not in the database")
      );
    }
    if (!productId) {
      return res.json(
        errorFunction(true, 204, "This product Id have not in the database")
      );
    }
    const cartItem = await Carts.find(filter);
    if (cartItem.length === 0) {
      const newCart = await Carts.create(req.body);
      if (newCart) {
        res.status(201);
        return res.json(errorFunction(false, 201, "Cart Created", newCart));
      } else {
        res.status(403);
        return res.json(errorFunction(true, 403, "Error Creating Cart"));
      }
    } else {
      const cartId = cartItem[0]._id;
      const quantity = cartItem[0].quantity + req.body.quantity;
      updateSameProduct(cartId, quantity, res);
    }
  } catch (error) {
    res.status(400);
    return res.json(errorFunction(true, 400, "Bad request"));
  }
};

//get all cart items
const getAllCarts = async (req, res, next) => {
  try {
    const {
      pageSize = 12,
      pageNumber = 1,
      productName = "",
      productBrand = "",
      type = "",
      orderByColumn,
      orderByDirection = "desc",
    } = req.query;
    const filter = {
      $and: [
        {
          productName: {
            $regex: productName,
            $options: "$i",
          },
        },
        {
          productBrand: {
            $regex: productBrand,
            $options: "$i",
          },
        },
        {
          type: {
            $regex: type,
            $options: "$i",
          },
        },
      ],
    };
    const filterCarts = await Carts.find(filter)
      .sort(`${orderByDirection === "asc" ? "" : "-"}${orderByColumn}`)
      .limit(pageSize * 1)
      .skip((pageNumber - 1) * pageSize);

    const allCarts = await Carts.find(filter);
    let totalPage = 0;
    if (allCarts.length % pageSize === 0) {
      totalPage = allCarts.length / pageSize;
    } else {
      totalPage = parseInt(allCarts.length / pageSize) + 1;
    }

    if (allCarts.length > 0) {
      res.status(200).json({
        totalPage: totalPage,
        totalProducts: allCarts.length,
        carts:
          orderByDirection && orderByColumn
            ? filterCarts
            : filterCarts.reverse(),
      });
    } else {
      res.status(200).json({
        massage: "No results",
        carts: [],
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(400).json({
      message: "Bad request",
    });
  }
};

//Get cart by cartId
const getCartById = async (req, res, next) => {
  const cartId = req.params.cartId;
  try {
    const cart = await Carts.findById(cartId);
    if (cart) {
      res.status(200).json({
        statusCode: 200,
        cart,
      });
    } else {
      res.json({
        statusCode: 204,
        message: "This cart Id have not in the database",
        cart: {},
      });
    }
  } catch (error) {
    res.status(400);
    return res.json(errorFunction(true, 400, "Bad request"));
  }
};

// get by user id
const getCartByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const filter = {
      $and: [
        {
          userId: {
            $regex: userId,
            $options: "$i",
          },
        },
      ],
    };
    const carts = await Carts.find(filter);
    if (carts) {
      res.status(200).json({
        statusCode: 200,
        total: carts.length,
        carts: carts.reverse(),
      });
    } else {
      return res.json(
        errorFunction(true, 204, "This cart Id have not in the database")
      );
    }
  } catch (error) {
    res.status(400);
    return res.json(errorFunction(true, 400, "Bad request"));
  }
};

//delete card by cardId
const deleteCartById = async (req, res, next) => {
  const cartId = req.params.cartId;
  try {
    const cart = await Carts.findByIdAndRemove(cartId);
    if (cart) {
      res.status(200).json({
        statusCode: 200,
        message: "Deleted cart successfully",
      });
    } else {
      res.json({
        statusCode: 204,
        message: "This cart Id have not in the database",
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(400);
    return res.json(errorFunction(true, 400, "Bad request"));
  }
};

// Delete multiple carts
const deleteMultipleCarts = async (req, res) => {
  const listProductsId = req.body;
  try {
    Promise.all(
      listProductsId.map((productId) => Carts.findByIdAndRemove(productId))
    )
      .then((response) => {
        res.status(200);
        return res.json(
          errorFunction(false, 200, "Deleted products in cart Successfully")
        );
      })
      .catch((error) => {
        res.status(400);
        return res.json(errorFunction(true, 400, "Bad request"));
      });
  } catch (error) {
    res.status(400);
    return res.json(errorFunction(true, 400, "Bad request"));
  }
};

//UPDATE - PUT || PATCH
const editCart = (req, res, next) => {
  try {
    const cartId = req.params.cartId;
    const isBodyEmpty = Object.keys(req.body).length;
    if (isBodyEmpty === 0) {
      return res.json(errorFunction(true, 404, "Body request can not empty."));
    }
    Carts.findByIdAndUpdate(cartId, req.body).then((data) => {
      if (data) {
        res.status(200).json({
          statusCode: 200,
          message: "Updated cart successfully",
        });
      } else {
        res.json({
          statusCode: 204,
          message: "This cart Id have not in the database ",
        });
      }
    });
  } catch (error) {
    res.status(400);
    return res.json(errorFunction(true, 400, "Bad request"));
  }
};

module.exports = {
  createCarts,
  addCartAndUpdateCart,
  getAllCarts,
  getCartById,
  getCartByUserId,
  deleteCartById,
  deleteMultipleCarts,
  editCart,
};
