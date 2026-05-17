const express =
 require("express");

const router =
 express.Router();

const {

 getNotifications,
 markAsRead

} = require(

 "../controllers/notificationController"

);

const {

 verifyToken

} = require(

 "../middleware/authMiddleware"

);

/*
========================
GET NOTIFICATIONS
========================
*/
router.get(

 "/user",

 verifyToken,

 getNotifications

);

/*
========================
MARK AS READ
========================
*/
router.put(

 "/:id/read",

 verifyToken,

 markAsRead

);

module.exports =
 router;