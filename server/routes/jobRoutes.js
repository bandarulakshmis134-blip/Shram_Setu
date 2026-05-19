const express = require("express");

const router = express.Router();

const {

 createJob,
 getJobs,
 getMyJobs,
 deleteJob

} = require(
 "../controllers/jobController"
);

const {

 verifyToken

} = require(
 "../middleware/authMiddleware"
);

/*
============================
CREATE JOB
============================
*/
router.post(
 "/create",
 verifyToken,
 createJob
);

/*
============================
GET ALL JOBS
============================
*/
router.get(
 "/",
 getJobs
);

/*
============================
GET MY JOBS
============================
*/
router.get(
 "/my-jobs/:userId",
 getMyJobs
);

/*
============================
DELETE JOB
============================
*/
router.delete(
 "/:id",
 verifyToken,
 deleteJob
);

module.exports =
 router;