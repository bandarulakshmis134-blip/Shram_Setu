const express = require("express");

const router = express.Router();

const {

  createRequest,
  getWorkerRequests

} = require(
  "../controllers/jobRequestController"
);

const {

  verifyToken

} = require(
  "../middleware/authMiddleware"
);

/*
CREATE REQUEST
*/
router.post(
  "/create",
  createRequest
);

/*
GET WORKER REQUESTS
*/
router.get(
  "/worker",
  verifyToken,
  getWorkerRequests
);

module.exports = router;