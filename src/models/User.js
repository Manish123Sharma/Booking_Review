const mongoose = require('../config/db');
const { Schema, SchemaTypes } = mongoose;
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    user_id: {
        type: SchemaTypes.String,
        unique: true,
        index: true
    },
    fullName: {
        type: SchemaTypes.String,
        required: true,
        index: true,
        trim: true
    },
    password: {
        type: SchemaTypes.String,
        required: true,
        minlength: 6,
        index: true,
    },
    email: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
        match: /.+@.+\..+/,
        index: true,
        lowercase: true
    },
},
    {
        timestamps: true
    }
);

UserSchema.pre('save', async function (next) {

    if (!this.user_id) {
        this.user_id = uuidv4();
    }


    if (this.fullName) {
        this.fullName = this.fullName.trim();
    }

    if (!this.isModified("password")) { return next(); }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;