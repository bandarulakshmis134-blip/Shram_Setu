const express = require("express");

const router = express.Router();

const { updateUser } = require("../controllers/userController");


// update profile
router.put("/update/:id", updateUser);


module.exports = router;