const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: [true, 'Must enter product name'] },
  price: { type: Number, required: [true, 'Price field is required'] }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
