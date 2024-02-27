const Order=require('../../models/orderSchema')

module.exports={

    showOrderList: async(req,res)=>{
        const orders=await Order.find({})
        console.log(orders)
        res.render('admin/orders',{title:'Orders',orders:orders})
    }

}