const router = require('express').Router();
const Item = require ('../models/Item');
const { isAuthenticated } = require('../middlewares/jwt');
const ErrorResponse = require('../utils/error');
const fileUploader = require("../config/cloudinary.config");


// @desc    Get all user items
// @route   GET /api/v1/items
// @access  Private
router.get('/', isAuthenticated, async (req, res, next) => {
    const id = req.payload._id;
    try {
      const items = await Item.find({owner: id});
      if (!items) {
        next(new ErrorResponse('No items found for user', 404));
      }
      res.status(200).json({ data: items })
    } catch (error) {
      next(error);
    }
  });

  // @desc    Search item by serial number
  // @route   GET /api/v1/items/search
  // @access  Public
  router.post('/search', isAuthenticated, async (req, res, next) => {
    const {serialNumber} = req.body;
    if (serialNumber === "") {
      return next(new ErrorResponse('Please insert a Serial Number', 400))
    }
    try {
      const item = await Item.findOne({serialNumber: serialNumber}).populate('owner');
      if (!item) {
        next(new ErrorResponse(`Item with serial number ${serialNumber} is not registered in our database`, 404));
      }
      res.status(200).json({ data: item })
    } catch (error) {
      next(error);
    }
  });

  // @desc    Get single item
  // @route   GET /api/v1/items/:id
  // @access  Private
  router.get('/:id', isAuthenticated, async (req, res, next) => {
    const { id } = req.params;
    const userId = req.payload.email;
    try {
      const item = await Item.findById(id).populate('owner').populate('previousOwner');
      if (!item) {
        next(new ErrorResponse(`Item not found by id: ${id}`, 404));
      }
      if (userId === item.owner.email) {
        res.status(200).json({ data: item })
      } else {
        next(new ErrorResponse(`Unauthorised access`, 403))
      }
    } catch (error) {
      next(error);
    }
  });
  
  // @desc    Create an item
  // @route   POST /api/v1/items
  // @access  Private
  router.post('/', isAuthenticated, async (req, res, next) => {
    const { name, brand, newItem, type, serialNumber, imageUrls} = req.body;
    if (name === "" || brand === "" || type === "" || serialNumber === "" ||  imageUrls === "") {
        return next(new ErrorResponse('Please fill all the fields to create your item', 400))
    }
    const snRegex = /[^a-z0-9]/;
    if(!snRegex.test(serialNumber)) {
      return next(new ErrorResponse('Serial Number must be registered only with letters and numbers'))
    }
    const id = req.payload._id;
    try {
      const item = await Item.create({ name, brand, newItem, type, serialNumber, imageUrls, owner: id });
      if (!item) {
        next(new ErrorResponse('An error ocurred while creating the item', 500));
      }
      res.status(201).json({ data: item })
    } catch (error) {
      next(error);
    }
  });

  // @desc    Route for upload images
  // @route   POST /api/v1/items/upload
  // @access  Private
  router.post("/upload", fileUploader.single("imageUrl"), (req,res,next) => {
    if(!req.file) {
      next(new ErrorResponse('Error uploading image', 500));
      return;
    } 
    res.json({fileUrl: req.file.path })
  })

  
  // @desc    Edit an item
  // @route   PUT /api/v1/items/:id
  // @access  Private
  router.put('/:id', isAuthenticated, async (req, res, next) => {
    const { id } = req.params;
    const userId = req.payload.email;
    const { name, brand, newItem, type, serialNumber, imageUrls} = req.body;
    if (name === "" || brand === "" || newItem === "" || type === "" || serialNumber === "" ||  imageUrls === "") {
        return next(new ErrorResponse('Please fill all the fields to edit your item', 400))
    }
    try {
      const item = await Item.findById(id).populate('owner');
      if (!item) {
        next(new ErrorResponse(`Item not found by id: ${id}`, 404));
      } 
      if (userId === item.owner.email) {
        const updatedItem = await Item.findByIdAndUpdate(id, { name, brand, newItem, type, serialNumber, imageUrls}, { new: true });
        res.status(202).json({ data: updatedItem })
      }
      else {
        next(new ErrorResponse(`Unauthorised access`, 403))
      }
    } catch (error) {
      next(error);
    }
  });
  
  // @desc    Delete an item
  // @route   DELETE /api/v1/itemss/:id
  // @access  Private
  router.delete('/:id', isAuthenticated, async (req, res, next) => {
    const { id } = req.params;
    try {
      const item = await Item.findById(id);
      if (!item) {
        next(new ErrorResponse(`Item not found by id: ${id}`, 404));
      } else {
        const deleted = await Item.findByIdAndDelete(id);
        res.status(202).json({ data: deleted });
      }
    } catch (error) {
      next(error);
    }
  });


module.exports = router;