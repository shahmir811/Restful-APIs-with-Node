const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const OrdersController = require('../controllers/OrdersController');

/////////////////////////////////////////////////////////////////////////
// Get all orders
router.get('/', auth, OrdersController.orders_get_all);

/////////////////////////////////////////////////////////////////////////
// Create new order
router.post('/', auth, OrdersController.orders_create_order);

/////////////////////////////////////////////////////////////////////////
// Get order details
router.get('/:orderId', auth, OrdersController.orders_get_order);

/////////////////////////////////////////////////////////////////////////
// Delete order
router.delete('/:orderId', auth, OrdersController.orders_delete_order);

module.exports = router;
