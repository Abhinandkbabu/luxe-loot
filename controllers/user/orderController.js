const Order = require("../../models/orderSchema");
const Cart = require("../../models/cartSchema");
const User = require("../../models/userSchema");
const mongoose = require("mongoose");
const moment = require("moment-timezone");
const Product = require("../../models/productSchema");

module.exports = {
  placeOrder: async (req, res) => {
    try {
      const addressId = new mongoose.Types.ObjectId(req.body.selectedAddress);
      const userid = new mongoose.Types.ObjectId(req.session.user._id);
      const user = await User.aggregate([
        { $unwind: "$Address" },
        { $match: { "Address._id": addressId } },
      ]);
      const address = user[0].Address;
      const cart = await Cart.findOne({ UserId: userid });
      for (let i = 0; i < cart.Items.length; i++) {
        console.log(cart.Items[i].ProductId, cart.Items[i].quantity);
        await Product.updateOne(
          { _id: cart.Items[i].ProductId },
          { $inc: { stock: -cart.Items[i].quantity } },
          { new: true }
        );
      }
      const totelAmount = req.session.CartPrice.subtotal;
      const discountAmount = req.session.CartPrice.totaldiscount;

      // date setting------------------------------------------
      const currentDate = moment().tz("Asia/Kolkata").format("L LT");

      // delivery date ----------------------------------------
      const deliveryDate = moment()
        .add(4, "days")
        .tz("Asia/Kolkata")
        .format("L LT");

      const order = await Order.create({
        userid: userid,
        products: cart.Items,
        address: address,
        orderDate: currentDate,
        expectedDeliveryDate: deliveryDate,
        paymentMethod: req.body.paymentMethod,
        PaymentStatus: "Pending",
        orderStatus: "Order Processing",
        totalAmount: totelAmount,
        discountAmount: discountAmount,
      });
      if (order) {
        res.json({ success: true });
      }
    } catch (err) {
      console.log(err);
    }
  },

  postChangeOrderStatus: async (req, res) => {
    try {
    console.log("admin")
      const order = await Order.updateMany(
        { _id: req.body.orderId },
        {
          $set: {
            orderStatus: req.body.newStatus,
            "products.$[].OrderStatus": req.body.newStatus,
          },
        }
      );

      if (order) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    } catch (err) {
      console.log(err);
    }
  },

  getOrders: async (req, res) => {
    try {
      const userid = new mongoose.Types.ObjectId(req.session.user._id);
      const order = await Order.find({ userid: userid }).populate(
        "products.ProductId"
      );
      res.render("user/orders", { order });
    } catch (err) {
      console.log(err);
    }
  },

  getViewOrder: async (req, res) => {
    try {
      const orderid = req.params.id;
      const order = await Order.findOne({ _id: orderid }).populate(
        "products.ProductId"
      );
      console.log(order);
      res.render("user/viewOrder", { order });
    } catch (err) {
      console.log(err);
    }
  },

  cancelOrder: async (req, res) => {
    try {
      const id = req.params.id;
      const cancel = await Order.updateOne(
        { _id: id },
        {
          $set: {
            orderStatus: "Canceled",
            "products.$[].OrderStatus": "Canceled",
          },
        }
      );
      if (cancel) {
        res.json({ success: true });
      }
    } catch (err) {
      console.log(err);
    }
  },

  singleOrderCancel: async (req, res) => {
    try {
      const orderId = req.params.orderid;
      const productId = req.params.productid;
      const cancel = await Order.updateOne(
        { _id: orderId, "products.ProductId": productId },
        { $set: { "products.$.OrderStatus": "Canceled" } },
        { new: true }
      );
      if (cancel) {
        res.json({ sucess: true });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
