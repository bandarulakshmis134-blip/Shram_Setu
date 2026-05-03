const Message = require("../models/Message");
const User = require("../models/User");

/*
=====================================
1. GET MESSAGES BETWEEN TWO USERS
=====================================
*/
exports.getMessages = async (req, res) => {
  try {
    let { userId, receiverId } = req.query;

    // 🔥 normalize to string
    userId = userId.toString();
    receiverId = receiverId.toString();

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
=====================================
2. GET CONVERSATIONS
=====================================
*/
exports.getConversations = async (req, res) => {
  try {

    const { userId } = req.query;

    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    }).sort({ createdAt: -1 });

    const uniqueUserIds = new Set();

    messages.forEach(msg => {

      if (msg.senderId.toString() !== userId) {
        uniqueUserIds.add(msg.senderId.toString());
      }

      if (msg.receiverId.toString() !== userId) {
        uniqueUserIds.add(msg.receiverId.toString());
      }

    });

    const users = await User.find({
      _id: { $in: Array.from(uniqueUserIds) }
    }).select("firstName lastName email");

    const formatted = users.map(u => ({
      _id: u._id, // ✅ ALWAYS USER ID
      name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
      email: u.email
    }));

    res.json(formatted);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};