const Schedule = require("../models/Schedule");

/*
========================
WORKER SCHEDULE
========================
*/
exports.getWorkerSchedule = async (
  req,
  res
) => {

  try {

    const schedules = await Schedule.find({

      worker: req.user.id

    })

    .populate("job")

    .sort({ createdAt: -1 });

    res.json(schedules);

  }

  catch (error) {

    console.log(
      "WORKER SCHEDULE ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });

  }

};



/*
========================
ADMIN SCHEDULE
========================
*/
exports.getAdminSchedule = async (
  req,
  res
) => {

  try {

    const schedules = await Schedule.find({

      client: req.user.id

    })

    .populate("job")

    .sort({ createdAt: -1 });

    res.json(schedules);

  }

  catch (error) {

    console.log(
      "ADMIN SCHEDULE ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });

  }

};