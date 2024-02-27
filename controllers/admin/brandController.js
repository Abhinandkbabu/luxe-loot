const Brand=require('../../models/BrandSchema')
const Product=require('../../models/productSchema')
const flash=require('express-flash')

module.exports={

    getBrands: async(req,res)=>{
        const brand=await Brand.find()
        res.render('admin/brands',{brand,title:'Brands'})
    },

    getAddBrand: async(req,res)=>{
        res.render('admin/addBrand',{title:'Brand'})
    },

    postAddBrand: async(req,res)=>{
        const Name=req.body.Name
        const data=await Brand.findOne({Name:Name})
        if(data){
            req.flash('msg','already exist')
            req.flash('type','danger')
            res.redirect('/admin/brands')
        } 
        else {
            await Brand.insertMany({Name})
            req.flash('msg','Brand Added Successfully')
            req.flash('type','success')
            res.redirect('/admin/brands')
        }
    },

    deleteBrand:async(req,res)=>{
        const id=req.params.id
        await Product.deleteMany({brand:id})
        await Brand.deleteOne({_id:id})
        req.flash('msg','Brand Deleted Successfully')
        req.flash('type','danger')
        res.redirect('/admin/brands')
    },
}