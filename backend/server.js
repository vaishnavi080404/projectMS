const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db'); // 1. Import DB config
const { errorHandler } = require('./middlewares/errorMiddleware'); // 2. Import Error Handler

dotenv.config();

// Connect to MongoDB
connectDB(); 

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', require('./routes/api'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

// 3. Error Middleware (MUST be after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});