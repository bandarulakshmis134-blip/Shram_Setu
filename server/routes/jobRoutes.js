const express = require("express");

const router = express.Router();

const {

 createJob,
 getJobs

} = require("../controllers/jobController");
const { verifyToken } = require("../middleware/authMiddleware");


router.post("/create",verifyToken, createJob);

/* IMPORTANT */
router.get("/", getJobs);


module.exports = router;