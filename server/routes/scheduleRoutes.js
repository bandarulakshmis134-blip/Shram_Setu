const express = require("express");

const router = express.Router();

const {
  getMySchedule
} = require("../controllers/scheduleController");

const {
  verifyToken
} = require("../middleware/authMiddleware");

/*
GET MY SCHEDULE
*/
router.get(
  "/my",
  verifyToken,
  getMySchedule
);

module.exports = router;