const mongoose = require('mongoose');
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/hellostocks';

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

  mongoose.connection.on('connected', () => {
    console.log(`MongoDB Connected Successfully`);
  });
  mongoose.connection.on('disconnected', () => {
    console.log(`MongoDB is disconnected`);
  });
  mongoose.connection.on('error', (err) => {
    console.log('MongoDB connection error', err);
  });