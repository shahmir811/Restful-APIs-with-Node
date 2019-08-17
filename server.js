process.env.NODE_CONFIG_DIR = './config';
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const connectDB = require('./api/config/db');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

const app = express();
connectDB();
const port = process.env.PORT || 5000;

// Used below code to log request
app.use(morgan('dev'));

// Making folder public
app.use('/uploads', express.static('uploads'));

// Below is body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Below code is used to avoid CORS error
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    res.status(200).json({});
  }
  next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

//////////////////////////////////////////////////////////////////////////////////////
// Below code is for error handling
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ error: { message: error.message } });
});

app.listen(port, () => console.log(`Server is running at port ${port}`));
