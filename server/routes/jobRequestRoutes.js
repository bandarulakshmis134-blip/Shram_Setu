const express = require("express");

const router = express.Router();

const {

  createRequest,
  getWorkerRequests,
  getUserRequests,
  getWorkerHistory,
  getWorkerCompleted,
  updateRequestStatus,
  deleteRequest,
  sendWorkOTP,
  verifyWorkOTP,
  rateWorker

} = require(
  "../controllers/jobRequestController"
);

const {

  verifyToken,

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
GET WORKER COMPLETED
*/
router.get(
 "/worker-completed",
 verifyToken,
 getWorkerCompleted
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

/*
SEND WORK OTP
*/
router.post(
 "/:id/send-work-otp",
 verifyToken,
 sendWorkOTP
);

router.post(
 "/:id/rate",
 verifyToken,
 rateWorker
);
/*
VERIFY WORK OTP
*/
router.post(
 "/:id/verify-work-otp",
 verifyToken,
 verifyWorkOTP
);

module.exports = router;