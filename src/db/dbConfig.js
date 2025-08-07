const mongoose = require('mongoose');
require('dotenv').config();
const URI = process.env.URI;
const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log(mongoose.connection.name);
        
        console.log('Database connected');
    } catch (error) {
        console.log(error);
        console.error('Database connection failed');
    }
};

module.exports = connectDB;