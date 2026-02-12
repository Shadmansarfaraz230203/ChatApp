import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

/**
 * Register a new user
 */
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    // Validate required fields
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "Account already exists" });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user record
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio
    });

    // Generate authentication token
    const token = generateToken(newUser._id);

    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully"
    });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Login an existing user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });
    if (!userData) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    // Generate authentication token
    const token = generateToken(userData._id);

    res.json({
      success: true,
      userData,
      token,
      message: "Login successfully"
    });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Check if the user is authenticated
 * User data is attached via authentication middleware
 */
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

/**
 * Update user profile details (name, bio, profile picture)
 */
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updatedUser;

    // Update name and bio only
    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true, fields: { password: 0 } }
      );
    }
    // Update profile picture along with other details
    else {
      const upload = await cloudinary.uploader.upload(profilePic);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }

    res.json({ success: true, user: updatedUser });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
