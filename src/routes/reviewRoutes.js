const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const reviewController = require('../controllers/reviewController');

router.post("/:id/reviews", protect, reviewController.addReview);

router.put("/:id", protect, reviewController.updateReview);

router.delete("/:id", protect, reviewController.deleteReview);


module.exports = router;