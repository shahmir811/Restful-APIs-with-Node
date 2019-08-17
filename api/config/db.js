const mongoose = require('mongoose');
const db = 'mongodb://localhost:27017/node-rest-shop';

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log(error.message);

    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
