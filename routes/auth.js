const router = require('express').Router();
const User = require('../models/User');
const ErrorResponse = require('../utils/error');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require('../middlewares/jwt');
const saltRounds = 10;

// @desc    SIGN UP new user
// @route   POST /api/v1/auth/signup
// @access  Public
router.post('/signup', async (req, res, next) => {
  const { email, fullName, password, username, idNumber, telephone} = req.body;
  // Check if email or password or name are provided as empty string 
  if (email === "" || password === "" || username === "" || fullName === "" || idNumber === "" || telephone === "") {
    return next(new ErrorResponse('Please fill all the fields to register', 400))
  }
  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return next(new ErrorResponse('Email is not a valid format', 400))
  }
   // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    return next(new ErrorResponse('Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter', 400))
  }
  // Use regex to validate idNumber format
  const nifRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
  if (!nifRegex.test(idNumber)) {
    return next(new ErrorResponse('Spanish ID format not valid', 400));
  }
  // Use regex to validate telephone number
  const telephoneRegex = /^\+?(6\d{2}|7[1-9]\d{1})\d{6}$/;
  if (!telephoneRegex.test(telephone)) {
    return next(new ErrorResponse('Telephone number is not valid', 400));
  }

  try {
    const userMailInDB = await User.findOne({ email });
    const nifInDB = await User.findOne({idNumber});
    const usernameInDB = await User.findOne({username})
    if (userMailInDB) {
      return next(new ErrorResponse(`User already exists with email ${email}`, 400))
    } 
    if (nifInDB) {
      return next(new ErrorResponse(`This ID is already registered`, 400))
    }
    if (usernameInDB) {
      return next(new ErrorResponse(`Username is already registered`, 400))
    }
    else {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const user = await User.create({ email, hashedPassword, username, fullName, idNumber, telephone});
      const publicUser = { // Decide what fields of our user we want to return 
        fullName: user.fullName,
        email: user.email,
      }
      res.status(201).json({ data: publicUser });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    LOG IN user
// @route   POST /api/v1/auth/login
// @access  Public
router.post('/login', async (req, res, next) => { 
  const { email, password } = req.body;
  // Check if email or password are provided as empty string 
  if (email === "" || password === "") {
    return next(new ErrorResponse('Please fill all the fields to login', 400))
  }
  try {
    // First let's see if the user exists
    const userInDB = await User.findOne({ email });
    // If they don't exist, return an error
    if (!userInDB) {
      return next(new ErrorResponse(`No user registered by email ${email}`, 404));
    } else {
      const passwordMatches = bcrypt.compareSync(password, userInDB.hashedPassword);
      if (passwordMatches) {
        // Let's create what we want to store 
        const payload = {
          email: userInDB.email,
          username: userInDB.username,
          _id: userInDB._id,
          fullName: userInDB.fullName
        }
        // Use the jwt middleware to create de token
        const authToken = jwt.sign(
          payload,
          process.env.TOKEN_SECRET,
          { algorithm: 'HS256', expiresIn: "30d" }
        );
        res.status(200).json({ authToken: authToken })
      } else {
        // If the password is not right, return an error
        next(new ErrorResponse('Unable to authenticate user', 401));
      }
    }
  } catch (error) {
    next(error)
  }
});


// @desc    Edits logged in user
// @route   PUT /api/v1/auth/user
// @access  Private
router.put('/user', isAuthenticated, async (req, res, next) => {
  const {username, password, telephone} = req.body;
  const id = req.payload._id;
  if (username === "" || password === "" || telephone === "") {
    return next(new ErrorResponse('Please fill all the fields before editing', 400))
  }
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    return next(new ErrorResponse('Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter', 400))
  }
  const telephoneRegex = /^\+?(6\d{2}|7[1-9]\d{1})\d{6}$/;
  if (!telephoneRegex.test(telephone)) {
    return next(new ErrorResponse('Telephone number is not valid', 400));
  }
  try {
    const usernameInDB = await User.findOne({username})
    if (usernameInDB) {
      return next(new ErrorResponse(`Username is already registered`, 400))
    } else {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const updatedUser = await User.findByIdAndUpdate(id, { hashedPassword, username, telephone }, {new: true});
      res.status(202).json({ data: updatedUser });
    }
  } catch (error) {
    next(error);
  }
})


// @desc    GET logged in user
// @route   GET /api/v1/auth/me
// @access  Private
router.get('/me', isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json(req.payload);
})

// @desc    GET logged in user model
// @route   GET /api/v1/auth/getuser
// @access  Private
router.get('/getuser', isAuthenticated, async (req, res, next) => {
  const id = req.payload._id;
  try {
    const userInDB = await User.findById(id);
      res.status(200).json({ data: userInDB });
  } catch (error) {
    next(error);
  }
})

module.exports = router;