const express = require("express");

const router = express.Router();

const {

 createRequest

} = require("../controllers/jobRequestController");


router.post("/create",createRequest);

module.exports = router;