

import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;
    try {
        if (!email || !fullName || !password) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }


        const existingUser = await User.findOne({ email });


        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilepic: newUser.profilepic,
            });

        } else {
            return res.status(400).json({ message: "Invalid user data." });
        }

    } catch (error) {
        console.log("Error during signup:", error.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. FIX: Check if data exists before processing
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide both email and password." });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // 2. Safety Check: Ensure user has a password in DB (e.g. in case of Google Auth users)
        if (!user.password) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilepic: user.profilepic,
        });

    } catch (error) {
        console.log("Error during login:", error.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out successfully." });

    } catch (error) {
        console.log("Error during logout:", error.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilepic } = req.body;
        const userId = req.user._id;

        if (!profilepic) {
            return res.status(400).json({ message: "Profile picture URL is required." });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilepic)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilepic: uploadResponse.secure_url },
            { new: true }
        )

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error during profile update:", error.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

export const checkAuth = (req, res) => {
    try{
        res.status(200).json({ user: req.user });
    }catch(error){
        console.log("Error in checkAuth:", error.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
}