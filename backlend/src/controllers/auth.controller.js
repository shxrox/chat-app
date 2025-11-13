// This is your controller file (e.g., auth.controller.js)

import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js'; // Assuming utils.js is in ../lib/

export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;
    try {
        if (!email || !fullName || !password) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        // You found the user and saved them in the 'existingUser' variable
        const existingUser = await User.findOne({ email });

        // 
        //================================================================
        //  THE ERROR WAS HERE
        //================================================================
        //
        //  if(user){ // <--- THIS WAS THE BUGGY LINE. You used a variable 'user' that doesn't exist (it's undefined).
        //
        //  BELOW IS THE CORRECTED LINE:
        //  You must check the variable you actually used: 'existingUser'
        //
        if (existingUser) { // <--- THIS IS THE FIXED LINE
            return res.status(400).json({ message: "User with this email already exists." });
        }
        //================================================================
        //  END OF FIX
        //================================================================
        //

        // The rest of your code is already correct
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

// These functions were in your file, so I'm leaving them unchanged
export const login = (req, res) => {
    res.send("Login route");
};

export const logout = (req, res) => {
    res.send("Logout route");
};