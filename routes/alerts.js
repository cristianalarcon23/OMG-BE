const router = require('express').Router();
const Alert = require ('../models/Alert');
const { isAuthenticated } = require('../middlewares/jwt');
const ErrorResponse = require('../utils/error');

// @desc    Creates stolen alert
// @route   GET /api/v1/alerts/:id
// @access  Private
router.post('/:id', isAuthenticated, async (req, res, next) => {
    const user = req.payload._id;
    const {id} = req.params;
    try {
        const alert = await Alert.create({ itemId: id, userId: user });
        if (!alert) {
          next(new ErrorResponse('An error ocurred while creating the alert', 500));
        }
        res.status(201).json({ data: alert })
      } catch (error) {
        next(error);
      }
  });

  // @desc    Delete an alert
  // @route   DELETE /api/v1/alerts/:id
  // @access  Private
  router.delete('/:id', isAuthenticated, async (req, res, next) => {
    const { id } = req.params;
    try {
      const alert = await Alert.find({itemId: id});
      if (!alert) {
        next(new ErrorResponse(`Alert not found`, 404));
      } else {
        const deleted = await Alert.findOneAndDelete({itemId: id});
        res.status(202).json({ data: deleted });
      }
    } catch (error) {
      next(error);
    }
  });

  module.exports = router;