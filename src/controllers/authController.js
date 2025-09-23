const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
    try {

        const {
            fullName,
            email,
            password
        } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are neccessary" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            fullName,
            email,
            password
        });
        const token = generateToken({ id: user.id });

        res.status(201).json({
            user: {
                _id: user.id,
                fullName: user.fullName,
                email: user.email,
            },
            token,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are neccessary" });
        }

        const user = await User.findOne({
            email
        });
        
        if (user && (await user.matchPassword(password))) {
            const token = generateToken({id: user.id});
            res.json({
                user: {
                    _id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                },
                token
            });
        } else {
            res.status(401).json({
                message: 'Invalid email or password'
            });
        }

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}