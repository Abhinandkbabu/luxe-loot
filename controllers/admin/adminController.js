const session=require('express-session')
const User=require('../../models/userSchema')
const Category=require('../../models/catagorySchema')
const Brand=require('../../models/BrandSchema')
require('dotenv').config()
const flash = require('express-flash');


module.exports={

    initial: async(req,res)=>{
        res.render('admin/dashboard',{title:"Dashboard"})
    },

    getSignIn: async(req,res)=>{
        try{
            res.render('admin/signIn')
        }catch (error){
            console.log(error)
        }
    },

    postSignIn: async(req,res)=>{
        const Email=req.body.Username
        const Password=req.body.Password
        console.log(Email,Password)
        if(Email==process.env.AdminMail&&Password==process.env.adminloginPassword){
             req.session.adminloged=true
            res.redirect('/admin')
        }else{
            req.flash('error','Incorrect Username or Password')
            res.redirect('/admin/signin')
        }
    },

    getCostomer:async (req,res)=>{
        await User.find().exec()
       .then((data)=>{
        res.render('admin/customer',{data,title:'Customer'})
       })
       .catch((err)=> console.log(err))
        
    },

    blockUser: async (req,res)=>{
        const id=req.params.id
        await User.updateOne({_id:id},{$set:{Status:'Blocked'}})
        res.redirect('/admin/customer')
    },

    unBlockUser: async (req,res)=>{
        const id=req.params.id
        await User.updateOne({_id:id},{$set:{Status:'Active'}})
        res.redirect('/admin/customer')
    },


}