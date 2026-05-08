const Application = require("../models/Application");
const Job = require("../models/Job");
const Schedule = require("../models/Schedule");

/*
========================
APPLY FOR JOB
========================
*/
exports.applyJob = async (req, res) => {

  try {

    const { jobId } = req.body;

    const userId = req.user.id;

    /*
    PREVENT DUPLICATE
    */
    const existing = await Application.findOne({

      job: jobId,

      worker: userId

    });

    if (existing) {

      return res.status(400).json({
        message: "Already applied"
      });

    }

    const application = new Application({

      job: jobId,

      worker: userId

    });

    await application.save();

    res.status(201).json({
      message: "Applied successfully"
    });

  }

  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



/*
========================
GET APPLICATIONS FOR JOB OWNER
(Admin panel)
========================
*/
exports.getJobApplications = async (
  req,
  res
) => {

  try {

    const userId = req.user.id;

    const jobs = await Job.find({

      postedBy: userId

    });

    const jobIds = jobs.map(
      (j) => j._id
    );

    const applications =
      await Application.find({

        job: { $in: jobIds }

      })

      .populate(
        "worker",
        "firstName profilePic"
      )

      .populate(
        "job",
        "title"
      );

    res.json(applications);

  }

  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



/*
========================
GET WORKER APPLICATIONS
========================
AUTO DELETE INVALID JOBS
*/
exports.getMyApplications = async (
  req,
  res
) => {

  try {

    const userId = req.user.id;

    /*
    GET APPLICATIONS
    */
    let applications =
      await Application.find({

        worker: userId

      })

      .populate("job");

    /*
    REMOVE INVALID APPLICATIONS
    */
    const validApplications = [];

    for (const app of applications) {

      if (!app.job) {

        /*
        AUTO DELETE BROKEN APPLICATION
        */
        await Application.findByIdAndDelete(
          app._id
        );

      }

      else {

        validApplications.push(app);

      }

    }

    /*
    SEND ONLY VALID
    */
    res.json(validApplications);

  }

  catch (error) {

    console.log(
      "GET APPLICATIONS ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });

  }

};



/*
========================
UPDATE APPLICATION STATUS
========================
*/
exports.updateApplicationStatus = async (
  req,
  res
) => {

  try {

    const { status } = req.body;

    /*
    VALIDATION
    */
    if (
      !["accepted", "rejected"].includes(status)
    ) {

      return res.status(400).json({
        message: "Invalid status"
      });

    }

    /*
    UPDATE APPLICATION
    */
    const application =
      await Application.findByIdAndUpdate(

        req.params.id,

        { status },

        { new: true }

      )

      .populate("job")

      .populate("worker");

    if (!application) {

      return res.status(404).json({
        message: "Application not found"
      });

    }

    /*
    CREATE SCHEDULE
    ONLY IF ACCEPTED
    */
    if (status === "accepted") {

      /*
      UPDATE JOB STATUS
      */
      await Job.findByIdAndUpdate(

        application.job?._id,

        {
          status: "accepted"
        }

      );

      /*
      AVOID DUPLICATE SCHEDULES
      */
      const existingSchedule =
        await Schedule.findOne({

          job: application.job?._id,

          worker: application.worker?._id

        });

      if (!existingSchedule) {

        await Schedule.create({

          job: application.job?._id,

          worker: application.worker?._id,

          /*
          FIXED CLIENT ID
          */
          client:
            application.job?.postedBy?._id ||
            application.job?.postedBy,

          title: application.job?.title,

          /*
          CURRENT DATE
          */
          date: new Date()

        });

      }

    }

    res.json({

      message: `Application ${status}`,

      application

    });

  }

  catch (error) {

    console.log(
      "UPDATE STATUS ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });

  }

};



/*
========================
DELETE APPLICATION
========================
*/
exports.deleteApplication = async (
  req,
  res
) => {

  try {

    const application =
      await Application.findById(
        req.params.id
      );

    if (!application) {

      return res.status(404).json({
        message: "Application not found"
      });

    }

    /*
    DELETE APPLICATION
    */
    await Application.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Application deleted"
    });

  }

  catch (error) {

    console.log(
      "DELETE APPLICATION ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });

  }

};