const router = require('express').Router();
const Item = require ('../models/Item');
const Alert = require ('../models/Alert');
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require('../middlewares/jwt');
const ErrorResponse = require('../utils/error');


// @desc    Get all user items
// @route   GET /api/v1/items/
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
  router.get('/search', async (req, res, next) => {
    const {serialNumber} = req.body;
    try {
      const item = await Item.findOne({serialNumber: serialNumber});
      if (!item) {
        next(new ErrorResponse(`Item with serial number: ${serialNumber} is not registered in our database`, 404));
      }
      const alert = await Alert.find({itemId: item._id});
      if (alert.length !== 0) {
        next(new ErrorResponse(`Item with serial number (${serialNumber}) is marked as lost/stolen`))
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
    try {
      const item = await Item.findById(id);
      if (!item) {
        next(new ErrorResponse(`Item not found by id: ${id}`, 404));
      }
      res.status(200).json({ data: item })
    } catch (error) {
      next(error);
    }
  });
  
  // @desc    Create an item
  // @route   POST /api/v1/items
  // @access  Private
  router.post('/', isAuthenticated, async (req, res, next) => {
    const { name, brand, secondHand, type, serialNumber, itemPicture, snPicture, warrantyPicture } = req.body;
    if (name === "" || brand === "" || secondHand === undefined || type === "" || serialNumber === "" ||  itemPicture === "" || snPicture === "") {
        return next(new ErrorResponse('Please fill all the fields to create your item', 400))
    }
    const id = req.payload._id;
    try {
      const item = await Item.create({ name, brand, secondHand, type, serialNumber, itemPicture, snPicture, warrantyPicture, owner: id });
      if (!item) {
        next(new ErrorResponse('An error ocurred while creating the item', 500));
      }
      res.status(201).json({ data: item })
    } catch (error) {
      next(error);
    }
  });
  
  // @desc    Edit an item
  // @route   PUT /api/v1/items/:id
  // @access  Private
  router.put('/:id', isAuthenticated, async (req, res, next) => {
    const { id } = req.params;
    const { name, brand, secondHand, type, serialNumber, itemPicture, snPicture, warrantyPicture } = req.body;
    if (name === "" || brand === "" || secondHand === undefined || type === "" || serialNumber === "" ||  itemPicture === "" || snPicture === "") {
        return next(new ErrorResponse('Please fill all the fields to edit your item', 400))
    }
    try {
      const item = await Item.findById(id);
      if (!item) {
        next(new ErrorResponse(`Item not found by id: ${id}`, 404));
      } else {
        const updatedItem = await Item.findByIdAndUpdate(id, { name, brand, secondHand, type, serialNumber, itemPicture, snPicture, warrantyPicture }, { new: true });
        res.status(202).json({ data: updatedItem })
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