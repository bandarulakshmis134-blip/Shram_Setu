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
 searchWorkers,
 syncWorkerSkills
} = require("../controllers/workerController");

router.post("/register", registerWorker);
router.get("/check/:userId", checkIfWorker);
router.get("/search", searchWorkers);
router.get("/top-workers", getTopWorkers);

// 🔥 IMPORTANT: PUT routes BEFORE /:id
router.put("/sync-skills", syncWorkerSkills);
router.put("/update-skills", updateWorkerSkills);

router.get("/count-by-skill", getWorkerCountBySkill);

router.delete("/:id", deleteWorker);
router.get("/:id", getWorkerById);

module.exports = router;