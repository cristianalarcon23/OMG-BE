const router = require('express').Router();
const Item = require ('../models/Item');
const User = require('../models/User');
const { isAuthenticated } = require('../middlewares/jwt');
const ErrorResponse = require('../utils/error');

// @desc    GET all the items
// @route   GET /api/v1/items
// @access  Private


module.exports = router;