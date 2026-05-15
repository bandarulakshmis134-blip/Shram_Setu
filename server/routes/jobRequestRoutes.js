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

  verifyToken,
  sendWorkOTP,
  verifyWorkOTP

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

/*
SEND WORK OTP
*/
router.post(
 "/:id/send-work-otp",
 verifyToken,
 sendWorkOTP
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