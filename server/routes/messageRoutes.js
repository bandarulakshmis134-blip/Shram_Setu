const express =
 require("express");

const router =
 express.Router();

const {

 getMessages,
 getConversations,
 sendMessage,
 markMessagesAsSeen

} = require(

 "../controllers/messageController"

);

/*
=====================================
GET MESSAGES
=====================================
*/
router.get(
 "/",
 getMessages
);

/*
=====================================
GET CONVERSATIONS
=====================================
*/
router.get(
 "/conversations",
 getConversations
);

/*
=====================================
SEND MESSAGE
=====================================
*/
router.post(
 "/send",
 sendMessage
);

/*
=====================================
MARK AS SEEN
=====================================
*/
router.put(
 "/seen",
 markMessagesAsSeen
);

module.exports =
 router;