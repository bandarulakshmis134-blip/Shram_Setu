const Schedule = require("../models/Schedule");
const User = require("../models/User");

/*
========================
GET MY SCHEDULE
========================
*/
exports.getMySchedule = async (req, res) => {

  try {

    /*
    GET USER
    */
    const user = await User.findById(
      req.user.id
    );

    let schedules = [];

    /*
    ========================
    WORKER PANEL
    ========================
    */
    if (user.role === "worker") {

      schedules = await Schedule.find({

        worker: req.user.id

      })

      .populate("job")

      .sort({ createdAt: -1 });

    }

    /*
    ========================
    ADMIN / CLIENT PANEL
    ========================
    */
    else {

      schedules = await Schedule.find({

        client: req.user.id

      })

      .populate("job")

      .sort({ createdAt: -1 });

    }

    res.json(schedules);

  }

  catch (error) {

    console.log(
      "SCHEDULE ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });

  }

};