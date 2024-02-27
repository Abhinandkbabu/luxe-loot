const express = require('express');
const router=express.Router()
const userController=require("../controllers/user/userController")
const userAuth = require('../middleware/userAuth');
const productController = require('../controllers/admin/productController');
const cartController=require('../controllers/user/cartCotroller')
const addressController=require('../controllers/user/addressController')
const orderController=require('../controllers/user/orderController')


router.route('/')
.get(userAuth.verifyUser,userController.initial)

router.route('/guest')
.get(userAuth.userExist,userController.gust)


router.route('/signIn')
.get(userAuth.userExist, userController.signIn)
.post(userController.postsignin)


router.route('/signUp')
.post(userController.signUpPost)


router.route('/send-otp')
.get(userController.getotp)
.post(userController.postotp)

router.route('/resend-otp')
.get(userController.reSendOTP)

router.route('/profileView')
.get(userAuth.verifyUser,userController.getUserProfile)

router.route('/forgotPassword')
.get(userController.getForgetPassword)
.post(userController.postForgetPassword)

router.route('/resetPassword/:email/:token')
.get(userController.getResetPassword)
.post(userController.postResetPassword)
//-------Product---------------------------------
router.route('/productList')
.get(productController.getProductList)

router.route('/productView/:id')
.get(productController.getProductView)

// ----------------product End-----------------

// ------------------cart----------------------------
router.route('/cart')
.get(userAuth.userAllowed,cartController.getCart)

router.route('/addtocart/:id')
.get(userAuth.verifyUser,cartController.postAddToCart)

router.route('/removeCartItem/:id/:proId')
.get(userAuth.verifyUser,cartController.removeCartItem)

router.route('/changeProductQuantity')
.post(cartController.changeQuantity)
// --------------------cart End------------------------

//----------------address------------------------------
router.route('/checkout')
.get(userAuth.verifyUser,addressController.getCheckout)

router.route('/updateAddress')
.post(userAuth.verifyUser,userController.postUpdateAddress)

//-------------------Order----------------------------
router.route('/orders')
.get(userAuth.verifyUser,orderController.getOrders)

router.route('/placeOrder')
.post(userAuth.verifyUser,orderController.placeOrder)

router.route('/viewOrder/:id')
.get(userAuth.verifyUser,orderController.getViewOrder)

router.route('/changeOrderStatus')
.post(orderController.postChangeOrderStatus)

router.route('/cancelOrder/:id')
.get(orderController.cancelOrder)

router.route('/singleCancel/:orderid/:productid')
.get(orderController.singleOrderCancel)

//-----------------userProfile----------------
router.route('/userUpdateName')
.post(userAuth.verifyUser,userController.postEditName)

router.route('/userUpdatePassword')
.post(userController.postUserUpdatePassword)


router.route('/logout')
.get((req,res)=>{
    req.session.destroy()
    res.redirect('/')

})
module.exports=router