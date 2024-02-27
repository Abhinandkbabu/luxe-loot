const Category=require('../../models/catagorySchema')
const Brand=require('../../models/BrandSchema')

module.exports={
    
    getcategory: async(req,res)=>{
        let category=await Category.find()
        res.render('admin/catagories',{category ,title:'Category'})
        
    },
    
    getAddCategory: async(req,res)=>{
        const success=req.flash('success')
        res.render('admin/addCategory',{success,title:'Category'})
    },

    postAddCategory: async(req,res)=>{
        try{
            const Name=req.body.Name
        const data= await Category.findOne({Name:Name})
        if(data) res.send("Catogory exist")
        else await Category.insertMany({Name})
        req.flash('msg','Category Added Successfully')
        req.flash('type','success')
        res.redirect('/admin/categories')
        }catch(error){
            
        }
    },

    deleteCategory:async(req,res)=>{
        const id=req.params.id
        await Category.deleteOne({_id:id})
        req.flash('msg','Category Deleted Successfully')
        req.flash('type','danger')
        res.redirect('/admin/categories')
    },
    

}