const express = require("express");

const router = express.Router();

const {

 updateUser,
 retireWorker,
 disableAccount

} = require("../controllers/userController");

/*
====================================
UPDATE PROFILE
====================================
*/
router.put(
 "/update/:id",
 updateUser
);

/*
====================================
RETIRE WORKER
====================================
*/
router.delete(
 "/retire/:id",
 retireWorker
);

/*
====================================
DISABLE ACCOUNT
====================================
*/
router.delete(
 "/disable/:id",
 disableAccount
);

module.exports = router;