const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const bookController = require('../controllers/bookController');

router.post('/addBook', protect, bookController.addBook);

router.get('/getBooks', bookController.getAllBooks);

router.get('/getBookbyId', bookController.getBokkbyId);

router.get('/search', bookController.searchBook);

module.exports = router;