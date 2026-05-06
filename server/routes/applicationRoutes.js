const express = require("express");
const router = express.Router();

const {
  applyJob,
  getJobApplications,
  getMyApplications,
  deleteApplication,
  updateApplicationStatus
} = require("../controllers/applicationController");

const { verifyToken } = require("../middleware/authMiddleware");

router.post("/apply", verifyToken, applyJob);
router.get("/admin", verifyToken, getJobApplications);
router.get("/worker", verifyToken, getMyApplications);
router.put("/:id/status",verifyToken,updateApplicationStatus);
router.delete("/:id",verifyToken,deleteApplication);

module.exports = router;