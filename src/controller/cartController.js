const cartModel = require('../model/cartModel');
const userModel = require('../model/userModel')
const productModel = require('../model/productModel');
const Validator = require("../validation/validation");

const createCart = async function (req, res) {
  const userId = req.params.userId;
  if (!Validator.isValidObjectId(userId)) {
    return res
      .status(400)
      .send({ status: false, message: " Enter a valid userId" });
  }

  let user = await userModel.findById(userId);
  if (!user) {
    return res
      .status(400)
      .send({ status: false, message: "No user Found!" });
  }

  const data = req.body
  if (!Validator.isValidBody(data)) {
    return res.status(400).send({
      status: false,
      message: "Product data is required for cart",
    });
  }

  const { productId, cartId } = data
  if (!Validator.isValidObjectId(productId)) {
    return res
      .status(400)
      .send({ status: false, message: " Enter a valid productId" });
  }

  let productData = await productModel.findById(productId)

  if (!productData) {
    return res.status(400).send({ status: false, message: "Product doesn't exist" })
  }

  let cartData = await cartModel.findOne({ userId: userId })
  if (cartData) {
    if (cartId) {
      if (!Validator.isValidObjectId(cartId)) {
        return res
          .status(400)
          .send({ status: false, message: " Enter a valid cartId" });
      }
      if (cartId !== cartData._id) {
        return res.status(400).send({ status: false, message: "This cartId is not for this user" })
      }
      let arr = cartData.items
      let product1 = {
        'productId': productId,
        'quantity': 1
      }
      compareId = arr.findIndex(obj => obj.productId == productId)
      if (!compareId) {
        arr.push(product1)
      }
      arr[compareId].quantity = arr[compareId].quantity + 1
      arr[compareId].save()
    }
    let arr = cartData.items
    let product1 = {
      'productId': productId,
      'quantity': 1
    }
    compareId = arr.findIndex(obj => obj.productId == productId)
    if (!compareId) {
      arr.push(product1)
    }
    arr[compareId].quantity = arr[compareId].quantity + 1
    arr[compareId].save()
  }
  let itemArr = []
  let cartData1 = { userId: userId, items: itemArr }
  let product1 = {
    'productId': productId,
    'quantity': 1
  }
  itemArr.push(product1)

  let productt = await productModel.findById(productId)

  cartData1.totalPrice = productt.price

  cartData1.totalItems = 1
  console.log(cartData1)
  let cartCreate = await cartModel.create(cartData1)
  return res.status(201).send({ status: true, message: "Cart created successfully", data: cartCreate })

}


const getsCard = async function (req, res) {
  let user_Id = req.params.userId
  // if (!Validator.isValidObjectId(user_Id)) {
  //   return res
  //     .status(400)
  //     .send({ status: false, message: " Enter a valid userId" });
  // }
  // let uservalid = await userModel.findById(user_Id)

  // if (!uservalid) return res.status(404).send({ status: false, message: "user not found" })

  let cardDetails = await cartModel.findOne({ userId: user_Id }).populate()

  if (!cardDetails) return res.status(404).send({ status: false, message: "cart not found" })

  return res.status(200).send({ data: cardDetails })

}

module.exports = { createCart, getsCard }