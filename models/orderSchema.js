const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema=new Schema({
    userid:{
        type:Schema.Types.ObjectId,
    },
    products:[
        {
            ProductId:{type: Schema.Types.ObjectId,ref:'products'},
            quantity: { type: Number },
            OrderStatus:{type:String,default:'Order Processing'},
        },
    ],
    address: {
        name:String,
        addressLane: String,
        locality: String, 
        city: String,
        district: String,
        state: String,
        pincode: Number,
        mobile:Number,
      },
      orderDate: {
        type: Date,
        required: true,
      },
      expectedDeliveryDate: Date,
      paymentMethod: String,
      PaymentStatus: String,
      totalAmount: Number,
      deliveryDate: Date,
      orderStatus: String,
      couponDiscount:Number,
      couponCode: String,
      discountAmount: Number,
      rejectReason:String,
})
const order = mongoose.model("order", orderSchema);
module.exports = order;