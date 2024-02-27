const Cart=require('../../models/cartSchema')
const Product=require('../../models/productSchema')
const User = require('../../models/userSchema')


module.exports={

    getCart: async(req,res)=>{
        try{
            const userid = req.session.user.Email
        const user =await User.findOne({Email:userid})
        
        const cart = await Cart.aggregate([
            {
                $match: { UserId: user._id }
            },
            {
                $unwind:'$Items'
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'Items.ProductId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $project : {
                    productid: '$Items.ProductId',
                    quantity: '$Items.quantity',
                    product: {$arrayElemAt: ['$product',0]}
                }
            }
        ]);
        
        
        //---------Calculating amount-----------------------
        
       let cartPricing={
        subtotal:0,
        totaldiscount:0,
        totalprice:0,
        totalquantity:0,
       }
       console.log(cart)
        if(cart!=null){
            cart.forEach((item)=>{
                cartPricing.totalprice+=item.product.price*item.quantity;
                cartPricing.totaldiscount+= item.product.discountPrice*item.quantity;
                cartPricing.subtotal=cartPricing.totalprice - cartPricing.totaldiscount;
                cartPricing.totalquantity+=item.quantity
            })
        }
        req.session.CartPrice=cartPricing
        res.render('user/cartPage',{cart,cartPricing})
        }catch(err){console.log(err)}
    },

    postAddToCart : async(req,res)=>{
        try{
            if(req.session.user.Email){
            const userid=req.session.user;
            const productid= req.params.id
            let product=await Product.findOne({_id:productid})
            console.log("reached",userid);
           
            if(product&&product.stock>=1){ //checking the product availability
                const cart= await Cart.findOne({UserId:userid})
                if(cart){//if User already have a cart
            
                    const existingProduct = cart.Items.find(item => item.ProductId.toString() === productid)                                                                                                                 

                    if(existingProduct){ //if the product already in the cart
                        if(existingProduct.quantity < product.stock&&existingProduct.quantity <= 5){// increase the quantity in the cart
                            await Cart.updateOne(
                                { UserId : userid, 'Items.ProductId' : productid},
                                { $inc: { 'Items.$.quantity' : 1}}
                            );
                            res.json({response:true,user:true,msg:"added" })
                        }else{
                            res.json({response:false,user:true ,msg:"quatity exeeded " })
                        }
                    }else{
                        await Cart.updateOne(
                            { UserId: userid },
                            {
                                $push: {
                                    Items: {
                                        ProductId: productid,
                                        quantity: 1
                                    }
                                }
                            }
                            )
                            res.json({response:true,user:true,msg:"added" })
                    }

                }else{//if user dont have a cart

               const firstCart = {
                UserId : userid,
                Items : [
                    {
                        ProductId : req.params.id,
                        quantity : 1
                    }
                ]
                }

               await Cart.create(firstCart)
               res.json({response:true ,user:true ,msg:"Product Added To Cart" })
                }

            }else{
                res.json({response:true ,user:true ,msg:"count is 0" })
            }
        }else{
            res.json({response:false,user:false,msg:"login please" })
        }

        }catch (error){
            console.log(error)
        }
    },

    changeQuantity: async(req,res)=>{
        const{cart,product,count}=req.body
        const userid=req.session.user.Email;
        const user =await User.findOne({Email:userid})
        console.log(user);
            await Cart.updateOne(
                { _id : cart, 'Items.ProductId' : product},
                { $inc: { 'Items.$.quantity' : count}}
            );
            const cartt = await Cart.aggregate([
                {
                    $match: { UserId: user._id  }
                },
                {
                    $unwind:'$Items'  
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'Items.ProductId',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project : {
                        productid: '$Items.ProductId',
                        quantity: '$Items.quantity',
                        product: {$arrayElemAt: ['$product',0]}
                    }
                }
            ]);
            
            //---------Calculating amount-----------------------
           
           let cartPricing={
            subtotal:0,
            totaldiscount:0, 
            totalprice:0,
            totalquantity:0,
           }
           console.log(cartPricing)
            if(cartt!=null){
               
                cartt.forEach((item)=>{
                    cartPricing.totalprice+=item.product.price*item.quantity;
                    cartPricing.totaldiscount+= item.product.discountPrice*item.quantity;
                    cartPricing.subtotal=cartPricing.totalprice - cartPricing.totaldiscount;
                    cartPricing.totalquantity+=item.quantity
                })
            }
            req.session.CartPrice=cartPricing
            console.log(cartPricing)
            res.json({success: true ,cartPricing:cartPricing})
    },

    removeCartItem: async(req,res)=>{
       const Id= req.params.id
       const productId=req.params.proId
       try{
            await Cart.updateOne(
                {_id:Id},
                { $pull:{Items:{ProductId: productId} }}
            )
            res.json({success:true})
       }catch(err){
        console.log(err)
       }
    }

}

