const express = require("express");
const router = express.Router();

const {
 registerWorker,
 getTopWorkers,
 getWorkerById,
 updateWorkerSkills,
 deleteWorker,
 checkIfWorker,
 getWorkerCountBySkill,
 searchWorkers
} = require("../controllers/workerController");


/*
=====================================
REGISTER WORKER
=====================================
*/
router.post("/register", registerWorker);


/*
=====================================
CHECK IF USER IS WORKER
=====================================
*/
router.get("/check/:userId", checkIfWorker);


/*
=====================================
SEARCH WORKERS (VERY IMPORTANT FIX)
=====================================
*/
router.get("/search", searchWorkers);


/*
=====================================
TOP WORKERS
=====================================
*/
router.get("/top-workers", getTopWorkers);


/*
=====================================
GET WORKER BY ID
=====================================
*/
router.get("/:id", getWorkerById);


/*
=====================================
UPDATE SKILLS
=====================================
*/
router.put("/update-skills", updateWorkerSkills);


/*
=====================================
DELETE WORKER
=====================================
*/
router.delete("/:id", deleteWorker);


/*
=====================================
GET WORKER COUNT
=====================================
*/
router.get("/count-by-skill", getWorkerCountBySkill);


module.exports = router;