const router = require('express').Router();
const Item = require ('../models/Item');
const Transaction = require ('../models/Transaction');
const { isAuthenticated } = require('../middlewares/jwt');
const ErrorResponse = require('../utils/error');


// @desc    Shows all transactions
// @route   GET /api/v1/transactions
// @access  Private
router.get('/', isAuthenticated, async (req, res, next) => {
    const id = req.payload._id;
    try {
        const transactions = await Transaction.find().or([{ sellerId: id }, { buyerId: id }]).populate('buyerId').populate('sellerId').populate('itemId');
        if (!transactions) {
          next(new ErrorResponse('No transactions found', 404));
        }
        res.status(201).json({ data: transactions })
      } catch (error) {
        next(error);
      }
  });


// @desc    Accepts transfer process
// @route   POST /api/v1/transactions/receive
// @access  Private
router.post('/receive', isAuthenticated, async (req, res, next) => {
    const {token, email} = req.body;
    if (token === "" || email === "") {
      return next(new ErrorResponse('Please fill all the fields to check transaction', 400));
    }
    const userId = req.payload._id;
    try {
        const itemToCheck = await Item.findOne({transactionToken: parseInt(token)}).populate('owner');
        if (itemToCheck && email === itemToCheck.owner.email) {
            const itemReceived = await Item.findByIdAndUpdate(itemToCheck._id, {owner: userId, previousOwner: itemToCheck.owner._id, transactionToken: null}, {new:true});
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
    const token = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000).toString();
    try {
        const itemToCheck = await Item.findById(id);
        if (itemToCheck.transactionToken !== null) {
          next(new ErrorResponse('Existing token for item', 500));
        }
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