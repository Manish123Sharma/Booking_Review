const mongoose = require('../config/db');
const { Schema, SchemaTypes } = mongoose;
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const BookSchema = new Schema({
    book_id:{
        type: SchemaTypes.String,
        unique: true,
        index: true
    },
    title:{
        type: SchemaTypes.String,
        required: true,
        trim: true
    },
    author:{
        type: SchemaTypes.String,
        required: true,
        trim: true
    },
    genre:{
        type: SchemaTypes.String,
        required: true,
        trim: true
    },
    description:{
        type: SchemaTypes.String,
        required: true,
        trim: true
    },
    createdBy: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    }
},
    {
        timestamps: true
    }
);

BookSchema.pre('save', async function (next) {

    if (!this.book_id) {
        this.book_id = uuidv4();
    }

    next();
});

const Book = mongoose.model('Book', BookSchema);
module.exports = Book;