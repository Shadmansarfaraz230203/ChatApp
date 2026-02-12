import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

/**
 * Get all users except the logged-in user
 * Also returns the count of unseen messages for each user
 */
export const getUsersForSidebar = async (req, res) => {
  try {
    // Logged-in user ID (from auth middleware)
    const userId = req.user._id;

    // Fetch all users except the current user (exclude password field)
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

    // Store unseen message counts per user
    const unseenMessages = {};

    // Count unseen messages sent to the logged-in user
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false
      });

      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);

    res.json({
      success: true,
      users: filteredUsers,
      unseenMessages
    });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Get all messages between the logged-in user and a selected user
 */
export const getMessages = async (req, res) => {
  try {
    // Selected user ID from route params
    const { id: selectedUserId } = req.params;

    // Logged-in user ID
    const myId = req.user._id;

    // Fetch conversation messages between both users
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId }
      ]
    });

    // Mark received messages as seen
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    res.json({ success: true, messages });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Mark a single message as seen using message ID
 */
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    await Message.findByIdAndUpdate(id, { seen: true });

    res.json({ success: true });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Send a message to a selected user
 * Supports text and image messages
 */
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;

    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;

    // Upload image to Cloudinary if provided
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // Create message in database
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });

    // Emit real-time message to receiver if online
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
