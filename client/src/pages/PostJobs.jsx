import {
 useState,
 useEffect,
 useCallback,
 useRef
} from "react";

import axios from "../axiosInstance";

import JobCard from "../components/JobCard";

import PostJobModal from "../components/PostJobModal";

const PostJobs = ()=>{

 const [openModal,setOpenModal] =
  useState(false);

 const [jobs,setJobs] =
  useState([]);

 const [page,setPage] =
  useState(1);

 const [totalPages,setTotalPages] =
  useState(1);

 const [loading,setLoading] =
  useState(true);

 /*
 ==========================
 PREVENT MULTIPLE FETCH
 ==========================
 */
 const fetchingRef =
  useRef(false);

 /*
 ==========================
 OBSERVER TARGET
 ==========================
 */
 const observerRef =
  useRef(null);

 /*
 ==========================
 GET LOGGED-IN USER
 ==========================
 */
 const user = JSON.parse(

  sessionStorage.getItem(
   "user"
  ) || "null"

 );

 /*
 ==========================
 CHECK IF WORKER
 ==========================
 */
 const isWorker =

  user?.skills?.length > 0;

 /*
 ==========================
 FETCH JOBS
 ==========================
 */
 const fetchJobs =
  useCallback(async ()=>{

   /*
   ONLY WORKERS CAN VIEW JOBS
   */
   if(!isWorker){

    setLoading(false);

    return;

   }

   /*
   PREVENT DUPLICATE CALLS
   */
   if(fetchingRef.current){

    return;

   }

   try{

    fetchingRef.current =
     true;

    setLoading(true);

    const res =
     await axios.get(

      `${import.meta.env.VITE_API_URL}/api/jobs?page=${page}&userId=${user?._id}`

     );

    /*
    FILTER OUT OWN JOBS
    */
    const filteredJobs =
     (res.data.jobs || [])

      .filter((job)=>{

       const ownerId =

        typeof job.postedBy ===
        "object"

         ? job.postedBy?._id

         : job.postedBy;

       return (

        ownerId?.toString()

        !==

        user?._id?.toString()

       );

      });

    /*
    FORMAT
    */
    const formattedJobs =
     filteredJobs.map((job)=>({

      ...job,

      title:
       job.title ||
       "No title",

      category:
       job.category ||
       "General",

      location:
       job.location ||
       "Location not specified",

      budget:
       job.budget

        ? `₹${job.budget}`

        : "Budget not specified",

      posted:
       "Recently posted",

      type:
       job.urgency ||
       "flexible",

      label:

       job.urgency === "urgent"

        ? "Urgent"

        : job.urgency ===
          "24hrs"

        ? "24 Hours"

        : "Flexible"

     }));

    /*
    APPEND UNIQUE JOBS
    */
    setJobs((prev)=>{

     const existingIds =
      new Set(

       prev.map(
        (job)=>job._id
       )

      );

     const uniqueNewJobs =
      formattedJobs.filter(

       (job)=>

        !existingIds.has(
         job._id
        )

      );

     return [

      ...prev,

      ...uniqueNewJobs

     ];

    });

    setTotalPages(

     res.data.totalPages || 1

    );

   }

   catch(error){

    console.log(

     "Fetch jobs error:",

     error

    );

   }

   finally{

    fetchingRef.current =
     false;

    setLoading(false);

   }

  },[
    page,
    user?._id,
    isWorker
  ]);

 /*
 ==========================
 INITIAL LOAD
 ==========================
 */
 useEffect(()=>{

  const loadJobs = async () => {
   await fetchJobs();
  };

  void loadJobs();

 },[
    fetchJobs
 ]);

 /*
 ==========================
 INFINITE SCROLL
 ==========================
 */
 useEffect(()=>{

  /*
  ONLY WORKERS
  */
  if(!isWorker){

   return;

  }

  const observer =
   new IntersectionObserver(

    (entries)=>{

     const first =
      entries[0];

     /*
     LOAD NEXT PAGE
     */
     if(

      first.isIntersecting &&

      !loading &&

      page < totalPages

     ){

      setPage((prev)=>
       prev + 1
      );

     }

    },

    {

     threshold:0.5

    }

   );

  const currentRef =
   observerRef.current;

  if(currentRef){

   observer.observe(
    currentRef
   );

  }

  return ()=>{

   if(currentRef){

    observer.unobserve(
     currentRef
    );

   }

  };

 },[
    loading,
    page,
    totalPages,
    isWorker
 ]);

 /*
 ==========================
 AFTER NEW JOB POST
 ==========================
 */
 const handleAddJob = ()=>{

  /*
  RESET
  */
  setJobs([]);

  setPage(1);

  fetchJobs();

 };

 /*
 ==========================
 UI
 ==========================
 */
 return (

  <div className="min-h-screen bg-gray-100">

   {/* HEADER */}
   <div className="flex justify-between items-center px-6 py-6">

    <div>

     <h1 className="text-2xl font-bold">

      Job Marketplace

     </h1>

     <p className="text-gray-500">

      Find open opportunities posted by clients

     </p>

    </div>

    {/* POST BUTTON */}
    <button

     onClick={()=>
      setOpenModal(true)
     }

     className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"

    >

     + Post a Job

    </button>

   </div>

   {/* NON WORKER */}
   {!isWorker ? (

    <div className="flex items-center justify-center px-6 py-20">

     <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-lg w-full">

      <h2 className="text-2xl font-bold text-gray-800 mb-4">

       Register as a Worker

      </h2>

      <p className="text-gray-500 leading-relaxed">

       Complete your worker profile and add your skills to view jobs that match your services.

      </p>

     </div>

    </div>

   ) : (

    <>
     {/* JOBS */}
     <div className="grid md:grid-cols-2 gap-8 px-6 pb-6">

      {jobs.length === 0 && !loading ? (

       <p>

        No matching jobs found

       </p>

      ) : (

       jobs.map((job)=>(

        <JobCard
         key={job._id}
         job={job}
        />

       ))

      )}

     </div>

     {/* LOADING */}
     {loading && (

      <div className="text-center pb-10">

       <p className="text-gray-500">

        Loading jobs...

       </p>

      </div>

     )}

     {/* OBSERVER */}
     <div
      ref={observerRef}
      className="h-10"
     />

    </>

   )}

   {/* MODAL */}
   <PostJobModal

    isOpen={openModal}

    onClose={()=>
     setOpenModal(false)
    }

    onPost={handleAddJob}

   />

  </div>

 );

};

export default PostJobs;