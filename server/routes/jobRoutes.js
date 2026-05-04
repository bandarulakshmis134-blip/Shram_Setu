const express = require("express");
const router = express.Router();

const {
 createJob,
 getJobs,
 getMyJobs
} = require("../controllers/jobController");

const { verifyToken } = require("../middleware/authMiddleware");


/*
CREATE JOB
*/
router.post("/create", verifyToken, createJob);


/*
GET ALL JOBS (Marketplace)
*/
router.get("/", getJobs);


/*
🔥 GET MY JOBS (Dashboard)
*/
router.get("/my-jobs/:userId", getMyJobs);


module.exports = router;