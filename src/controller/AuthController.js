const User = require('../modals/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();



const secretKey = process.env.JWT_SECRET;
const register = async (req, res) => {
    const {name ,username,bio , email, password, age, gender, address, phone} = req.body;
    const image = req.file?.filename;
    if(!name|| !bio || !username || !email || !password || !age || !gender || !address || !phone) {
        return res.status(400).json({message: 'All fields are required'});
    }
    if(password.length < 8) {
        return res.status(400).json({message: 'Password must be at least 8 characters'});
    }
    if(password.length > 20) {
        return res.status(400).json({message: 'Password must be at most 20 characters'});
    }
    const isAuthenticated = true;
    const user = await User.create({name,username, bio,image, email, password, age, gender, address, phone , isAuthenticated});
    const result = await user;
    if (result) {
        res.status(200).json({message: 'User registered successfully' , data: result});
    } else {
        res.status(400).json({message: 'User registration failed'});
    };
}

const login = async (req , res) =>{
  const {email , password} = req.body;
      if(!email || !password) return res.status(400).json({message: 'All fields are required'});
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: 'User not found'});
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch) return res.status(400).json({message: 'Invalid credentials'});
        const  token = jwt.sign({id: user._id} , secretKey , {expiresIn: '1h'});
        res.status(200).json({message: 'User logged in successfully' , data: user , token});
}

const getAllUsers = async (req , res) => {
    const users = await User.find();
    res.status(200).json({message: 'Users fetched successfully' , data: users});
}

const getUserById = async (req , res) =>{
    const {userId} = req.params;
    const users = await User.findById(userId);
    res.status(200).json({message: 'Users fetched successfully' , data: users});
}

const updateUser = async (req , res) => {
    const {userId} = req.params;
    const {name,username , image, email, password, age, gender, address, phone} = req.body;
    const user = await User.findByIdAndUpdate(userId , {name,username , image, email, password, age, gender, address, phone});
    res.status(200).json({message: 'User updated successfully' , data: user});
}

const BanUser = async (req , res) => {
    const {userId} = req.params;
    const user = await User.findByIdAndUpdate(userId , {isAuthenticated: false});
    res.status(200).json({message: 'User banned successfully' , data: user});
}

const UnbanUser = async (req , res) => {
    const {userId} = req.params;
    const user = await User.findByIdAndUpdate(userId , {isAuthenticated: true});
    res.status(200).json({message: 'User unbanned successfully' , data: user});
}

const getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user); // <-- Directly return user
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

const deleteUser = async (req , res) => {
    const {userId} = req.params;
    const user = await User.findByIdAndDelete(userId);
    res.status(200).json({message: 'User deleted successfully' , data: user});
}


const searchUsers = async (req, res) => {
  const { query } = req.query;

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
      ],
    }).select('username name profilePic');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users', error: error.message });
  }
};



module.exports = {register,  searchUsers , getUserByUsername , login , getAllUsers , getUserById , updateUser , BanUser , UnbanUser , deleteUser};