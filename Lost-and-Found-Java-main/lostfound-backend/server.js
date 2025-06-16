require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const claimRoutes = require('./routes/claimRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Mount API routes
app.use('/api', userRoutes);
app.use('/api', postRoutes);
app.use('/api', claimRoutes);

// Mount admin routes under /api/admin (important for your frontend)
app.use('/api/admin', adminRoutes);

// (Optional) Root route
app.get('/', (req, res) => res.send('API is running!'));

// MongoDB connection
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI not set in .env file!');
  process.exit(1);
}


console.log('Connecting to MongoDB at:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));