const express = require("express");

const router = express.Router();

const {

  getWorkerSchedule,
  getAdminSchedule

} = require("../controllers/scheduleController");

const {

  verifyToken

} = require("../middleware/authMiddleware");

/*
========================
WORKER SCHEDULE
========================
*/
router.get(

  "/worker",

  verifyToken,

  getWorkerSchedule

);

/*
========================
ADMIN SCHEDULE
========================
*/
router.get(

  "/admin",

  verifyToken,

  getAdminSchedule

);

module.exports = router;