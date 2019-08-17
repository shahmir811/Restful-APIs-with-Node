const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

/////////////////////////////////////////////////////////////////////////
// Get all orders

exports.orders_get_all = async (req, res) => {
  try {
    const orders = await Order.find()
      .select('_id product quantity')
      .populate('product', '_id name');
    res.status(200).json({
      count: orders.length,
      orders: orders.map(order => {
        return {
          _id: order._id,
          product: order.product,
          quantity: order.quantity,
          request: {
            type: 'GET',
            url: `http://localhost:5000/orders/${order._id}`
          }
        };
      })
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error
    });
  }
};

/////////////////////////////////////////////////////////////////////////
// Create new order

exports.orders_create_order = async (req, res) => {
  // Check whether product with given id is present in product collection
  try {
    const product = await Product.findOne({ _id: req.body.productId });

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    // Storing values in Order collection
    try {
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
      });

      const response = await order.save();

      res.status(201).json({
        message: 'Order created successfully',
        createdOrder: {
          _id: response._id,
          product: response.product,
          quantity: response.quantity
        },
        request: {
          type: 'GET',
          url: `http://localhost:5000/orders/${response._id}`
        }
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        error
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Product not found'
    });
  }
};

/////////////////////////////////////////////////////////////////////////
// Get order details

exports.orders_get_order = async (req, res) => {
  const id = req.params.orderId;

  try {
    const order = await Order.findById(id)
      .select('_id product quantity')
      .populate('product');

    // if no order found
    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    res.status(200).json({
      order,
      request: {
        type: 'GET',
        description: 'Fetch all orders',
        url: `http://localhost:5000/orders`
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error
    });
  }
};

/////////////////////////////////////////////////////////////////////////
// Delete order

exports.orders_delete_order = async (req, res) => {
  const id = req.params.orderId;
  try {
    const order = await Order.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Order deleted',
      request: {
        type: 'POST',
        description: 'Create new order',
        url: `http://localhost:5000/orders`,
        data: { productId: 'ID', quantity: 'Number' }
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error
    });
  }
};
