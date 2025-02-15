import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Company from "../models/company.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

import {
  validateInput,
  validateLoginInput,
  validateEmail,
  validatePassword,
} from "../middleware/validateUser.js";

const passwordreset = asyncHandler(async (req, res) => {
  const { errors, isValid } = validatePassword(req.body);
  const token = req.params.token;
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired." });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      await User.updateOne({ _id: user._id }, {
        password:hashPassword,
      });
    }
    res.status(200).json({ success: 'Password updated' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { errors, isValid } = validateEmail(req.body);
  
  if (!isValid) {
    return res.status(400).json(errors);
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {      
      return res.status(400).json({        
        message: `account error`,
      });
    }
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 3; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }    
    const token = user._id + result;
    const resetPasswordToken = token;
    const resetPasswordExpires = Date.now() + 3600000;
    await User.updateOne({ _id: user._id }, {
      resetPasswordToken:resetPasswordToken,
      resetPasswordExpires:resetPasswordExpires
    });
    
    return res.status(200).json({
      email: email,
      name:user.name,
      resetPasswordToken: resetPasswordToken      
    });
  } catch (error) {
    return res.status(500).json(errors.message);
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      address: user.address,
      address2: user.address2,
      country_id: user.country_id,
      mobile: user.mobile,
      role: user.role,
      status:user.status,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, company, address, address2, country_id, mobile, password,transaction_id,status } = req.body;
  const userExists = await User.findOne({ email });  
  const companies = await Company.findOne({ company: company });
  if (companies) {
    res.status(400);
    throw new Error("company already exists");
  }
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    company,
    address,
    address2,
    country_id,
    mobile,
    transaction_id,
    status,
    password,
  });
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      address: user.address,
      address2: user.address2,
      country_id: user.country_id,
      mobile: user.mobile,
      role: user.role,
      status:user.status,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Logout user / clear cookie
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const { _id, name, email, company, address, address2, country_id, mobile } = req.body;
  await User.updateOne({ _id: _id }, {
      _id: _id,
      name: name,
      email: email,
      company: company,
      address: address,
      address2: address2,
      country_id: country_id,
      mobile: mobile,
  });
  const user = await User.findOne({ _id: _id });
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      address: user.address,
      address2: user.address2,
      country_id: user.country_id,
      mobile: user.mobile,
      role: user.role,
      status:user.status,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserPassword = asyncHandler(async (req, res) => {
  const { _id, password } = req.body;
  const user = await User.findById(_id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  } else{
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    await User.updateOne({ _id: _id }, {
      password: hashPassword,
    });
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      address: user.address,
      address2: user.address2,
      country_id: user.country_id,
      mobile: user.mobile,
      role: user.role,
      status:user.status,
    });
  }
});


// @desc    Update user profile

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.company = req.body.company || user.company;
    user.address = req.body.address || user.address;
    user.address2 = req.body.address2 || user.address2;
    user.country_id = req.body.country_id || user.country_id;
    user.mobile = req.body.mobile || user.mobile;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      company: updatedUser.company,
      address: updatedUser.address,
      address2: updatedUser.address2,
      country_id: updatedUser.country_id,
      mobile: updatedUser.mobile,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { userId, transactionId, expiryDate } = req.body;
  try {
    await User.updateOne({ _id: userId }, {
      status: 1,
      transaction_id: transactionId,
      expiryDate: expiryDate
    });
    const user = await User.findOne({ _id: userId });
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        company: user.company,
        address: user.address,
        address2: user.address2,
        country_id: user.country_id,
        mobile: user.mobile,
        role: user.role,
        status:user.status,
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
const updateUserD = asyncHandler(async (req, res) => {
  const { userId, company, address, address2, country_id, mobile,transactionId,status,expiryDate } = req.body;
    try {
    await User.updateOne({ _id: userId }, {
      company: company,
      address: address,
      address2: address2,
      country_id: country_id,
      mobile: mobile,
      status:status,
      transaction_id:transactionId,
      expiryDate:expiryDate
    });
    const user = await User.findOne({ _id: userId });
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        company: user.company,
        address: user.address,
        address2: user.address2,
        country_id: user.country_id,
        mobile: user.mobile,
        role: user.role,
        status:user.status,
      });
    } 
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


const activeUser = asyncHandler(async (req, res) => {
  try {
    const activeUsers = await User.find({ status: 1 }).sort({ createdAt: -1 });
    res.json(activeUsers);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

const inactiveUser = asyncHandler(async (req, res) => {
  try {
    const inactiveUsers = await User.find({ status: 0 , role: 0 }).sort({ createdAt: -1 });
    res.json(inactiveUsers);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();  
      res.json({ message: 'user removed' });
    } else {
      res.status(404).json({ error: 'user not found' });
    }
  } catch (error) {
    console.error('Error user site:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Define a controller function for handling login success

const directRegistration = asyncHandler(async (req, res) => {
  const { name, email, company, address, address2, country_id, mobile, password,transaction_id,status } = req.body;
  const userExists = await User.findOne({ email });  
  const companies = await Company.findOne({ company: company });
  if (companies) {
    res.status(400);
    throw new Error("company already exists");
  }
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    company,
    address,
    address2,
    country_id,
    mobile,
    transaction_id,
    status,
    password,
  });
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      address: user.address,
      address2: user.address2,
      country_id: user.country_id,
      mobile: user.mobile,
      role: user.role,
      status:user.status,
      provider:'card'
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export {  
  activeUser,
  inactiveUser,
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserPassword,
  updateUserProfile,
  updateUser,
  updateUserD,
  forgetPassword,
  passwordreset,  
  deleteUser,  
  directRegistration,
};
