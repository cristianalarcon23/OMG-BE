const router = require('express').Router();
const Item = require ('../models/Item');
const Transaction = require ('../models/Transaction');
const { isAuthenticated } = require('../middlewares/jwt');
const ErrorResponse = require('../utils/error');


// @desc    Shows all sold transactions
// @route   GET /api/v1/transactions/sold
// @access  Private
router.get('/sold', isAuthenticated, async (req, res, next) => {
    const id = req.payload._id;
    try {
        const transactionsSold = await Transaction.find({sellerId: id});
        if (!transactionsSold) {
          next(new ErrorResponse('No transactions found', 404));
        }
        res.status(201).json({ data: transactionsSold })
      } catch (error) {
        next(error);
      }
  });

// @desc    Shows all buy transactions
// @route   GET /api/v1/transactions/buy
// @access  Private
router.get('/buy', isAuthenticated, async (req, res, next) => {
    const id = req.payload._id;
    try {
        const transactionsBuy = await Transaction.find({buyerId: id});
        if (!transactionsBuy) {
          next(new ErrorResponse('No transactions found', 404));
        }
        res.status(201).json({ data: transactionsBuy });
      } catch (error) {
        next(error);
      }
  });



// @desc    Accepts transfer process
// @route   POST /api/v1/transactions/receive
// @access  Private
router.post('/receive', isAuthenticated, async (req, res, next) => {
    const {token, email} = req.body;
    const userId = req.payload._id;
    const resetedToken = "";
    try {
        const itemToCheck = await Item.findOne({transactionToken: parseInt(token)}).populate('owner');
        if (itemToCheck && email === itemToCheck.owner.email) {
            const itemReceived = await Item.findByIdAndUpdate(itemToCheck._id, {owner: userId, previousOwner: itemToCheck.owner._id, transactionToken: resetedToken}, {new:true});
            const transaction = await Transaction.create({itemId: itemToCheck._id, buyerId: userId, sellerId: itemToCheck.owner._id});
            res.status(201).json({ data: transaction, itemReceived })
        } else {
            next(new ErrorResponse('No item coincident', 500));
        }
      } catch (error) {
        next(error);
      }
  });

// @desc    Creates transfer process
// @route   POST /api/v1/transactions/transfer/:id
// @access  Private
router.post('/transfer/:id', isAuthenticated, async (req, res, next) => {
    const {id} = req.params;
    const token = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
    try {
        const itemTokened = await Item.findByIdAndUpdate(id, {transactionToken: token}, {new:true});
        if (!itemTokened) {
          next(new ErrorResponse('An error ocurred while creating the transfer', 500));
        }
        res.status(201).json({ data: itemTokened })
      } catch (error) {
        next(error);
      }
  });



  module.exports = router;