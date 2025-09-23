const Book = require('../models/Book');
const mongoose = require('mongoose');
const Review = require('../models/Review');

exports.addReview = async (req, res) => {
    try {
        const { id: bookId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;

        if (!mongoose.isValidObjectId(bookId)) return res.status(400).json({ message: "Invalid book id" });

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: "Book not found" });

        if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: "rating must be 1-5" });

        try {
            const review = await Review.create({
                user: userId,
                book: bookId,
                rating,
                comment,
            });
            return res.status(201).json(review);
        } catch (err) {
            if (err.code === 11000) {
                return res.status(400).json({ message: "You have already reviewed this book" });
            }
            throw err;
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;

        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid review id" });

        const review = await Review.findById(id);
        if (!review) return res.status(404).json({ message: "Review not found" });

        if (review.user.toString() !== userId.toString()) return res.status(403).json({ message: "Not allowed" });

        if (rating !== undefined) {
            if (rating < 1 || rating > 5) return res.status(400).json({ message: "rating must be 1-5" });
            review.rating = rating;
        }
        if (comment !== undefined) review.comment = comment;

        await review.save();
        res.json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid review id" });

        const review = await Review.findById(id);
        if (!review) return res.status(404).json({ message: "Review not found" });

        if (review.user.toString() !== userId.toString()) return res.status(403).json({ message: "Not allowed" });

        await review.deleteOne();
        res.json({ message: "Review deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}