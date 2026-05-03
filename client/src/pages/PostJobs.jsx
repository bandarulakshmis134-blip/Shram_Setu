import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import JobCard from "../components/JobCard";
import PostJobModal from "../components/PostJobModal";

const PostJobs = () => {

 const [openModal, setOpenModal] = useState(false);

 const [jobs, setJobs] = useState([]);

 const [page, setPage] = useState(1);

 const [totalPages, setTotalPages] = useState(1);

 const [loading, setLoading] = useState(true);



 /*
 ==========================
 FETCH JOBS FROM DATABASE
 ==========================
 */

 const fetchJobs = useCallback(async () => {

  try {

   setLoading(true);

   const res = await axios.get(
    `http://localhost:5000/api/jobs?page=${page}`
   );

   console.log("Jobs from DB:", res.data);


   // format DB jobs for JobCard UI
   const formattedJobs = res.data.jobs.map(job => ({

    title: job.title || "No title",

    category: job.category || "General",

    location: job.location || "Location not specified",

    budget: job.budget
     ? `₹${job.budget}`
     : "Budget not specified",

    posted: "Recently posted",

    type: job.urgency || "flexible",

    label:
     job.urgency === "urgent"
      ? "Urgent"
      : job.urgency === "24hrs"
      ? "24 Hours"
      : "Flexible"

   }));


   setJobs(formattedJobs);

   setTotalPages(res.data.totalPages || 1);

  }

  catch (error) {

   console.log("Fetch jobs error:", error);

  }

  finally {

   setLoading(false);

  }

 }, [page]);



 /*
 ==========================
 RUN WHEN PAGE CHANGES
 ==========================
 */

 useEffect(() => {

  fetchJobs();

 }, [fetchJobs]);



 /*
 ==========================
 AFTER POSTING NEW JOB
 ==========================
 */

 const handleAddJob = () => {

  fetchJobs(); // reload jobs

 };



 /*
 ==========================
 UI
 ==========================
 */

 return (

  <div className="min-h-screen bg-gray-100">


   {/* Header */}

   <div className="flex justify-between items-center px-6 py-6">

    <div>

     <h1 className="text-2xl font-bold">
      Job Marketplace
     </h1>

     <p className="text-gray-500">
      Find open opportunities posted by clients
     </p>

    </div>


    <button
     onClick={() => setOpenModal(true)}
     className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
    >

     + Post a Job

    </button>

   </div>



   {/* Job Cards */}

   <div className="grid md:grid-cols-2 gap-8 px-6 pb-6">

    {loading ? (

     <p>Loading jobs...</p>

    ) : jobs.length === 0 ? (

     <p>No jobs found</p>

    ) : (

     jobs.map((job, index) => (

      <JobCard
       key={index}
       job={job}
      />

     ))

    )}

   </div>



   {/* Pagination */}

   <div className="flex justify-center gap-4 pb-10">

    <button
     disabled={page === 1}
     onClick={() => setPage(page - 1)}
     className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
    >
     Previous
    </button>


    <span className="px-4 py-2">
     Page {page} of {totalPages}
    </span>


    <button
     disabled={page === totalPages}
     onClick={() => setPage(page + 1)}
     className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
    >
     Next
    </button>

   </div>



   {/* Post Job Modal */}

   <PostJobModal
    isOpen={openModal}
    onClose={() => setOpenModal(false)}
    onPost={handleAddJob}
   />


  </div>

 );

};

export default PostJobs;