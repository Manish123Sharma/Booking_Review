const mongoose = require('../config/db');
const { Schema, SchemaTypes } = mongoose;
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const ReviewSchema = new Schema({
    review_id: {
        type: SchemaTypes.String,
        unique: true,
        index: true
    },
    user: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: SchemaTypes.ObjectId,
        ref: 'Book',
        required: true
    },
    rating: {
        type: SchemaTypes.Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment:{
        type: SchemaTypes.String,
        trim: true
    }
},
    {
        timestamps: true
    }
);

ReviewSchema.pre('save', async function (next) {

    if (!this.review_id) {
        this.review_id = uuidv4();
    }

    next();
});

const Review = mongoose.model('Reviews', ReviewSchema);
module.exports = Review;