const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const multer = require('multer');

// Multer setup for storing files in storage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads/');
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname.split(' ').join('_')); // replace space with underscores
  }
});

const fileFilter = (req, file, callback) => {
  // only upload images of type jpeg, png or jpg
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    //accept file
    callback(null, true);
  } else {
    // reject file
    callback(
      new Error('Only upload files with extension jpeg, jpg or png'),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 } // only allow 10MB
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().select('name price _id productImage');
    const response = {
      count: products.length,
      products: products.map(product => {
        return {
          _id: product._id,
          name: product.name,
          price: product.price,
          productImage: product.productImage,
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

/////////////////////////////////////////////////////////////////////////
// Add Single Product

router.post('/', [auth, upload.single('productImage')], async (req, res) => {
  // upload only single image. productImage is req.file name

  try {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path
    });

    const response = await product.save();

    res.status(201).json({
      message: 'Created product successfully',
      createdProduct: {
        _id: response._id,
        name: response.name,
        price: response.price,
        productImage: product.productImage,
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
    const doc = await Product.findById(id).select(
      '_id name price productImage'
    );

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
router.patch('/:productId', auth, async (req, res) => {
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

router.delete('/:productId', auth, async (req, res) => {
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
