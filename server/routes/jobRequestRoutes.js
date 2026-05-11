const express = require("express");

const router = express.Router();

const {

  createRequest,
  getWorkerRequests,
  getUserRequests,
  getWorkerHistory,
  updateRequestStatus,
  deleteRequest

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

/*
GET WORKER HISTORY
*/
router.get(
 "/worker-history",
 verifyToken,
 getWorkerHistory
);

/*
GET USER REQUESTS
*/
router.get(
 "/user",
 verifyToken,
 getUserRequests
);

router.put(
 "/:id/status",
 verifyToken,
 updateRequestStatus
);

router.delete(
  "/:id",
  verifyToken,
  deleteRequest
);

module.exports = router;