import {
 useEffect,
 useState
} from "react";

import axios from "../utils/axiosInstance";

import {
 useNavigate
} from "react-router-dom";

import {
 FaTrash
} from "react-icons/fa";

const PostedJobs = ({
 showAll = false
}) => {

 const [jobs,setJobs] =
  useState([]);

 const [loading,setLoading] =
  useState(false);

 const navigate =
  useNavigate();

const [user] = useState(

 JSON.parse(
  sessionStorage.getItem("user") || "null"
 )

);
 /*
 ============================
 FETCH JOBS
 ============================
 */
 useEffect(()=>{

  if(!user?._id){

   return;

  }

  const fetchJobs =
   async ()=>{

    try{

     setLoading(true);

     const res =
      await axios.get(

       `${import.meta.env.VITE_API_URL}/api/jobs/my-jobs/${user._id}`

      );

     setJobs(
      res.data || []
     );

    }

    catch(error){

     console.log(

      "FETCH JOBS ERROR:",
      error

     );

    }

    finally{

     setLoading(false);

    }

   };

  fetchJobs();

 },[user?._id]);

 /*
 ============================
 DELETE JOB
 ============================
 */
 const handleDelete =
  async (jobId)=>{

   const confirmDelete =
    window.confirm(

     "Are you sure you want to delete this job?"

    );

   if(!confirmDelete){

    return;

   }

   try{

    await axios.delete(

     `${import.meta.env.VITE_API_URL}/api/jobs/${jobId}`,

     {

      headers:{

       Authorization:
        `Bearer ${user.token}`

      }

     }

    );

    /*
    REMOVE FROM UI
    */
    setJobs((prev)=>

     prev.filter(

      (job)=>

       job._id !== jobId

     )

    );

   }

   catch(error){

    console.log(

     "DELETE JOB ERROR:",
     error

    );

   }

  };

 /*
 ============================
 SHOW LIMITED JOBS
 ============================
 */
 const displayedJobs =
  showAll

   ? jobs

   : jobs.slice(0,2);

 return(

  <div className="bg-white p-5 rounded-xl shadow mb-6">

   {/* HEADER */}
   <div className="flex justify-between items-center mb-4">

    <h2 className="font-semibold">

     My Posted Jobs

    </h2>

    {!showAll && (

     <button

      onClick={()=>
       navigate(
        "/my-posted-jobs"
       )
      }

      className="text-blue-600 text-sm hover:text-blue-700"

     >

      View All

     </button>

    )}

   </div>

   {/* LOADING */}
   {loading ? (

    <p className="text-sm text-gray-400">

     Loading jobs...

    </p>

   ) : displayedJobs.length === 0 ? (

    <p className="text-gray-400 text-sm">

     No jobs posted yet

    </p>

   ) : (

    displayedJobs.map((job)=>(

     <div

      key={job._id}

      className="border rounded-xl p-4 mb-3 flex justify-between items-center hover:shadow-sm transition"

     >

      {/* LEFT */}
      <div>

       <p className="font-medium">

        {job.title}

       </p>

       <p className="text-sm text-gray-500">

        {job.category}
        {" • "}
        {job.location}

       </p>

       <p className="text-sm text-gray-400">

        Budget:
        {" "}
        ₹{job.budget}

       </p>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

       {/* STATUS */}
       <span

        className={`text-xs px-2 py-1 rounded-full ${
         job.status === "accepted"

          ? "bg-green-100 text-green-600"

          : "bg-blue-100 text-blue-600"
        }`}

       >

        {job.status === "accepted"

         ? "Accepted"

         : "Active"}

       </span>

       {/* DELETE */}
     {/* DELETE */}
{job.status !== "accepted" && (

 <button

  onClick={()=>
   handleDelete(
    job._id
   )
  }

  className="text-red-500 hover:text-red-700 transition"

 >

  <FaTrash />

 </button>

)}

      </div>

     </div>

    ))

   )}

  </div>

 );

};

export default PostedJobs;