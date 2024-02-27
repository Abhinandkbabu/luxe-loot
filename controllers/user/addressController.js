const User=require('../../models/userSchema')

module.exports={
    getCheckout: async(req,res)=>{
        const cart=req.session.CartPrice
        const email=req.session.user.Email
        const user= await User.findOne({Email:email})
        const Address=user.Address
        res.render('user/checkOut',{cart,Address})
    }
} 