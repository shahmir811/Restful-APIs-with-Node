const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');

const ProductsController = require('../controllers/ProductsController');

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

/////////////////////////////////////////////////////////////////////////
// Get all products
router.get('/', ProductsController.products_get_all);

/////////////////////////////////////////////////////////////////////////
// Add Single Product
router.post(
  '/',
  [auth, upload.single('productImage')],
  ProductsController.products_create_product
);

/////////////////////////////////////////////////////////////////////////
// Get record of single product
router.get('/:productId', ProductsController.products_get_product);

/////////////////////////////////////////////////////////////////////////
// update product data
router.patch('/:productId', auth, ProductsController.products_update_product);

/////////////////////////////////////////////////////////////////////////
// Delete product
router.delete('/:productId', auth, ProductsController.products_delete_product);

module.exports = router;
