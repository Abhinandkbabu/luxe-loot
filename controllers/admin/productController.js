const Brand=require('../../models/BrandSchema')
const Category=require('../../models/catagorySchema')
const Products=require('../../models/productSchema')
const flash=require('express-flash')


module.exports={

    getProducts: async(req,res)=>{
        try{
            const data=await Products.find().populate('brand').populate('category')
        res.render('admin/products',{data,title:'Products'}) 
        }
        catch(err){
            console.log(err);
        }
    },

    getAddProducts:async(req,res)=>{
       const brand =await Brand.find()
        const category=await Category.find()
        res.render('admin/addProducts',{brand,category,title:'Products'})
    },

    postAddProduct:async(req,res)=>{
        const files=req?.files
        let images=[files.image1[0].filename,files.image2[0].filename,files.image3[0].filename,files.image4[0].filename]

        const data={
            productName:req.body.productName,
            brand:req.body.brand,
            price:req.body.price,
            discountPrice:req.body.discountPrice,
            category:req.body.category,
            description:req.body.description,
            specification: req.body.specification,
            stock: req.body.stock,
            color: req.body.color,
            images:images
        }
        await Products.insertMany(data)
        req.flash('msg',`${data.productName} added`)
        req.flash('type','success')
        res.redirect('/admin/addProduct')
    },

    deleteProduct: async(req,res)=>{
        const id=req.params.id
        await Products.deleteOne({_id:id})
        req.flash('msg',`Product Deleted`)
        req.flash('type','success')
        res.redirect('/admin/product')
    },

    getEditProduct: async(req,res)=>{
        const id=req.params.id;
        const data = await Products.findOne({_id:id}).populate('brand').populate('category')
        const brand = await Brand.find()
        const category = await Category.find()
        res.render('admin/editProduct',{data,brand,category,title:'Product'})
    },

    postEditProduct: async(req,res)=>{
       try{
        const id = req.params.id
        const images=[];
        const proImg=await Products.findOne({_id:id})
        if(proImg){
          images.push(...proImg.images)
        }
      for(let i=0;i<5;i++){
          if(req.files[i]){
             let position=req.files[i].fieldname.split('')
             images[position[5]-1]=req.files[i].filename
          }
      }

      let UpdatedProducts=req.body
      UpdatedProducts.images=images;
      console.log(UpdatedProducts)
      
      const uploaded =await Products.updateOne({_id:id},{$set:{...UpdatedProducts}})

        if (uploaded) {
          res.redirect("/admin/product");
        }


       }catch(err){
        console.log(err)
       }
    },

    getBlockProduct:async(req,res)=>{
        let id=req.params.id
        await Products.updateOne({_id:id},{$set:{status:'Blocked'}})
        res.redirect('/admin/product')
    }, 

    getUnblockProduct:async(req,res)=>{
        let id=req.params.id
        await Products.updateOne({_id:id},{$set:{status:'Active'}})
        res.redirect('/admin/product')
    },

    getProductList:async(req,res)=>{
        let data=await Products.find().populate('brand')
        res.render('user/productList',{data})
    },

    getProductView:async(req,res)=>{
        const id=req.params.id
        let product= await Products.findOne({_id:id}).populate('brand')
        res.render('user/productDetails',{product})
    }

}