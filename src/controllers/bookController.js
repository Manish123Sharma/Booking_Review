const Book = require('../models/Book');
const mongoose = require('mongoose');
const Review = require('../models/Review');

exports.addBook = async (req, res) => {
    try {

        const {
            title,
            author,
            genre,
            description
        } = req.body

        if (!title || !author || !genre || !description) {
            return res.status(400).json({ message: "All fields are neccessary" });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }

        const bookExists = await Book.findOne({ title });
        if (bookExists) {
            return res.status(400).json({ message: "Book already exists" });
        }

        const book = await Book.create({
            title,
            author,
            genre,
            description,
            createdBy: req.user._id
        });
        res.status(200).json({
            _id: book.id,
            title: book.title,
            author: book.author
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getAllBooks = async (req, res) => {
    try {
        const { author, genre, page = 1, limit = 10 } = req.query;

        // Build query
        const query = {};
        if (author) query.author = { $regex: new RegExp(author, "i") };
        if (genre) query.genre = { $regex: new RegExp(genre, "i") };

        // Pagination
        const pageNum = Math.max(parseInt(page), 1);
        const lim = Math.max(parseInt(limit), 1);
        const skip = (pageNum - 1) * lim;

        // Fetch books + total count
        const [books, total] = await Promise.all([
            Book.find(query).sort({ createdAt: -1 }).skip(skip).limit(lim),
            Book.countDocuments(query),
        ]);

        res.status(200).json({
            total,
            page: pageNum,
            pages: Math.ceil(total / lim),
            books,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getBokkbyId = async (req, res) => {
    try {

        const query = req.query.query;

        if (!query) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        const book = await Book.findById(query);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        const agg = await Review.aggregate([
            { $match: { book: book._id } },
            {
                $group: {
                    _id: "$book",
                    avgRating: { $avg: "$rating" },
                    count: { $sum: 1 },
                },
            },
        ]);

        const avgRating = agg.length ? Number(agg[0].avgRating.toFixed(2)) : null;
        const reviewCount = agg.length ? agg[0].count : 0;

        const page = Math.max(parseInt(req.query.page || 1), 1);
        const limit = Math.max(parseInt(req.query.limit || 5), 1);
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ book: book._id })
            .populate("user", "username email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            book,
            averageRating: avgRating,
            reviewCount,
            reviews,
            reviewPage: page,
            reviewPages: Math.ceil(reviewCount / limit),
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.searchBook = async (req, res) => {
    try {

        const { query = "", page = 1, limit = 10 } = req.query;
        const pageNum = Math.max(parseInt(page), 1);
        const lim = Math.max(parseInt(limit), 1);
        const skip = (pageNum - 1) * lim;

        const q = query.trim();
        let filter = {};
        if (q.length) {
            const regex = new RegExp(q, "i");
            filter = {
                $or: [
                    {
                        title: regex
                    },
                    {
                        author: regex
                    }
                ]
            };
        }

        const [books, total] = await Promise.all([
            Book.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim),
            Book.countDocuments(filter),
        ]);

        res.json({
            total,
            page: pageNum,
            pages: Math.ceil(total / lim),
            books,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}