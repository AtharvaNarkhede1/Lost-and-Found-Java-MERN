const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database using the MONGO_URI environment variable.
 * Logs a success or error message.
 */
const connectDB = async () => {
  try {
    // Use the MONGO_URI environment variable or fall back to local if not provided
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/lostandfound';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to DB:', mongoose.connection.name);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
