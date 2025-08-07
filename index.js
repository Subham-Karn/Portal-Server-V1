const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require('./src/db/dbConfig');
const AuthRoute = require('./src/routes/AuthRoutes');
const port = process.env.PORT;
const allowedOrigins = [
  'http://localhost:5173',
  'https://frontend-for-portal.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
connectDB();
app.use('/api/auth' , AuthRoute);
app.use('/api/feed' , require('./src/routes/feedRoutes'));
app.use('/api/users' , require('./src/routes/followRoutes'));
app.listen(port, () => {
    console.log('Server is running on port 5000');
});