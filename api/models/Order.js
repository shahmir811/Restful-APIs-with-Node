const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Must mention product']
  },
  quantity: { type: Number, default: 1 }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
