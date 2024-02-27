const express = require('express');
const router=express.Router()
const adminController=require('../controllers/admin/adminController')
const adminAuth=require('../middleware/adminAuth')
const categoryControll=require('../controllers/admin/categoryController')
const productControll=require('../controllers/admin/productController')
const upload=require('../middleware/imgUpload')
const brandControll=require('../controllers/admin/brandController')
const OrderControll=require('../controllers/admin/orderController')

//initial
router.route('/')
.get(adminAuth.verifyAdmin,adminController.initial)

//signIn
router.route('/signin')
.get(adminAuth.adminExsist,adminController.getSignIn)
.post(adminController.postSignIn)

//  Products-------------------------------------------------------------
const uploadFields = [
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ];

router.route('/product')
.get(productControll.getProducts)

router.route('/addProduct')
.get(productControll.getAddProducts)
.post(upload.fields(uploadFields),productControll.postAddProduct)

router.route('/deleteProduct/:id')
.get(productControll.deleteProduct)

router.route('/editProduct/:id')
.get(productControll.getEditProduct)
.post(upload.any(),productControll.postEditProduct)

router.route('/blockProduct/:id')
.get(productControll.getBlockProduct)

router.route('/unBlockProduct/:id')
.get(productControll.getUnblockProduct)



//  Category--------------------------------------------------------------
router.route('/categories')
.get(categoryControll.getcategory)

router.route('/addCategory')
.get(categoryControll.getAddCategory)
.post(categoryControll.postAddCategory)

router.route('/deleteCategory/:id')
.get(categoryControll.deleteCategory)


//  Brand-----------------------------------------------------------------
router.route('/brands')
.get(brandControll.getBrands)

router.route('/addBrand')  
.get(brandControll.getAddBrand)
.post(brandControll.postAddBrand)

router.route('/deleteBrand/:id')
.get(brandControll.deleteBrand)


router.route('/admin/admins')
.get()

// User-------------------------------------------------------------------
router.route('/customer')
.get(adminController.getCostomer)

router.route('/blockUser/:id')
.get(adminController.blockUser)

router.route('/UnBlockUser/:id')
.get(adminController.unBlockUser)

//order------------------------------------------------------------------------
router.route('/orders')
.get(OrderControll.showOrderList)



router.route("/logout")
.get((req,res)=>{
    req.session.destroy() 
    res.send("loggedout")
})

module.exports=router