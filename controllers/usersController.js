const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const errorHandler = require('../middleware/errorHandler');

// @desc    Get All Users
// @route   GET /api/v2/users
// @access  Private - ADMIN

exports.getUsers = asyncHandler(async (req, res, next) => {

    const users = await User.find().populate({
        path: 'products',
        select: 'sifra'
    });
 
    res.status(200).json({
        success: true,
        data: users
    });         
 }); 

// @desc    Get User
// @route   GET /api/v2/users/:id
// @access  Private - ADMIN

exports.getUser = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({_id: req.params.id}).populate({
        path: 'products',
        select: 'sifra'
    });

    if (!user) {
        return next(new ErrorResponse(`Korisnik sa šifrom ${req.params.id} ne postoji.`, 400));
    }
 
    res.status(200).json({
        success: true,
        data: user
    });         
 }); 

// @desc    Delete User
// @route   DELETE /api/v2/users/:id
// @access  Private - ADMIN

exports.deleteUser = asyncHandler(async (req, res, next) => {

    await User.findByIdAndDelete(req.params.id);
 
    res.status(200).json({
        success: true,
        data: {}
    });         
 }); 