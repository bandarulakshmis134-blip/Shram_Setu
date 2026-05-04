import { useEffect, useState } from "react";
import axios from "axios";

const PostedJobs = () => {

  const [jobs, setJobs] = useState([]);

  const user = JSON.parse(
    sessionStorage.getItem("user") || "null"
  );

  useEffect(() => {

    if (!user?._id) return;

    const fetchJobs = async () => {
      try {

        const res = await axios.get(
          `http://localhost:5000/api/jobs/my-jobs/${user._id}`
        );

        setJobs(res.data || []);

      } catch (error) {
        console.log("FETCH JOBS ERROR:", error);
      }
    };

    fetchJobs();

  }, [user]);

  /*
  🔥 ONLY TAKE LATEST 2
  */
  const latestJobs = jobs.slice(0, 2);

  return (
    <div className="bg-white p-5 rounded-xl shadow mb-6">

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">My Posted Jobs</h2>

        <button className="text-blue-600 text-sm">
          View All
        </button>
      </div>

      {latestJobs.length === 0 ? (

        <p className="text-gray-400 text-sm">
          No jobs posted yet
        </p>

      ) : (

        latestJobs.map((job) => (

          <div
            key={job._id}
            className="border rounded-lg p-4 mb-3 flex justify-between items-center"
          >

            <div>
              <p className="font-medium">
                {job.title}
              </p>

              <p className="text-sm text-gray-500">
                {job.category} • {job.location}
              </p>

              <p className="text-sm text-gray-400">
                Budget: ₹{job.budget}
              </p>
            </div>

            <div className="flex items-center gap-3">

              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-600">
                Active
              </span>

              <button className="text-blue-600 text-sm">
                View
              </button>

            </div>

          </div>

        ))

      )}

    </div>
  );
};

export default PostedJobs;