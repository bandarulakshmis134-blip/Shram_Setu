const express = require("express");
const router = express.Router();

const { getMessages, getConversations } = require("../controllers/messageController");

router.get("/", getMessages);
router.get("/conversations", getConversations);

module.exports = router;