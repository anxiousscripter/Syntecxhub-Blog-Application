
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT
const generateToken = (userId) => {
    return jwt.sign(
        { sub: userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Cookie configuration
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
};

// Remove sensitive information before responding
const getSafeUser = (user) => {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };
};

// Register user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email and password.'
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address.'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters.'
            });
        }

        const existingUser = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists.'
            });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        const token = generateToken(user._id.toString());

        res.cookie('token', token, cookieOptions);

        return res.status(201).json({
            success: true,
            message: 'Account created successfully.',
            user: getSafeUser(user)
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists.'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        console.error('Registration error:', error);

        return res.status(500).json({
            success: false,
            message: 'An error occurred during registration.'
        });
    }
};

// Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password.'
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        const token = generateToken(user._id.toString());

        res.cookie('token', token, cookieOptions);

        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            user: getSafeUser(user)
        });

    } catch (error) {
        console.error('Login error:', error);

        return res.status(500).json({
            success: false,
            message: 'An error occurred during login.'
        });
    }
};

// Logout user
export const logoutUser = (req, res) => {
    res.clearCookie('token', cookieOptions);

    return res.status(200).json({
        success: true,
        message: 'Logged out successfully.'
    });
};

// Get currently authenticated user
export const getCurrentUser = (req, res) => {
    return res.status(200).json({
        success: true,
        user: getSafeUser(req.user)
    });
};