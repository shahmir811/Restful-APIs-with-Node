const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const multer = require('multer');
const upload = multer({ dest: '/uploads/' });

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().select('name price _id');
    const response = {
      count: products.length,
      products: products.map(product => {
        return {
          _id: product._id,
          name: product.name,
          price: product.price,
          request: {
            type: 'GET',
            url: `http://localhost:5000/products/${product._id}`
          }
        };
      })
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price
    });

    const response = await product.save();

    res.status(201).json({
      message: 'Created product successfully',
      createdProduct: {
        _id: response._id,
        name: response.name,
        price: response.price,
        request: {
          type: 'GET',
          url: `http://localhost:5000/products/${response._id}`
        }
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error
    });
  }
});

/////////////////////////////////////////////////////////////////////////
// Get record of single product
router.get('/:productId', async (req, res) => {
  const id = req.params.productId;

  try {
    const doc = await Product.findById(id);

    if (doc) {
      res.status(200).json({
        _id: doc._id,
        name: doc.name,
        price: doc.price,
        request: {
          type: 'GET',
          url: `http://localhost:5000/products/${doc._id}`
        }
      });
    } else {
      res.status(404).json({
        message: 'No record found'
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error
    });
  }
});

/////////////////////////////////////////////////////////////////////////
// update product data
router.patch('/:productId', async (req, res) => {
  const id = req.params.productId;

  try {
    const response = await Product.findByIdAndUpdate(
      { _id: id },
      {
        $set: req.body
      }
    ).select('_id name price');

    res.status(200).json({
      message: 'Record updated successfully',
      product: response,
      request: {
        type: 'GET',
        url: `http://localhost:5000/products/${id}`
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error
    });
  }
});

router.delete('/:productId', async (req, res) => {
  const id = req.params.productId;

  try {
    await Product.deleteOne({ _id: id });
    res.status(200).json({
      message: 'Record deleted successfully',
      request: {
        description: 'Add a new product',
        type: 'POST',
        url: 'http://localhost:5000/products',
        data: { name: 'String', price: 'Number' }
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error
    });
  }
});

module.exports = router;
