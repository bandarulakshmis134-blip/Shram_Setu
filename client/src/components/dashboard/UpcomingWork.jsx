import {
 useEffect,
 useState
} from "react";

import axios from "axios";

import {
 useNavigate
} from "react-router-dom";

const UpcomingWork = ({
 showAll = false
}) => {

 const navigate =
  useNavigate();

 const [jobs,setJobs] =
  useState([]);

 const [otpInputs,setOtpInputs] =
  useState({});

 const [loadingId,setLoadingId] =
  useState(null);

 /*
 =========================
 FETCH UPCOMING WORK
 =========================
 */
 const fetchUpcomingWork =
  async ()=>{

  try{

   const user = JSON.parse(

    sessionStorage.getItem(
     "user"
    )

   );

   const res = await axios.get(

    "http://localhost:5000/api/requests/worker-history",

    {
     headers:{
      Authorization:
       `Bearer ${user.token}`
     }
    }

   );

   setJobs(res.data || []);

  }

  catch(error){

   console.log(error);

   setJobs([]);

  }

 };

 /*
 LOAD
 */
 useEffect(()=>{

  fetchUpcomingWork();

 },[]);

 /*
 =========================
 SEND OTP
 =========================
 */
 const sendOTP = async (
  requestId
 )=>{

  try{

   setLoadingId(requestId);

   const user = JSON.parse(

    sessionStorage.getItem(
     "user"
    )

   );

   const res = await axios.post(

    `http://localhost:5000/api/requests/${requestId}/send-work-otp`,

    {},

    {
     headers:{
      Authorization:
       `Bearer ${user.token}`
     }
    }

   );

   alert(
    res.data.message
   );

  }

  catch(error){

   console.log(error);

   alert(
    "Failed to send OTP"
   );

  }

  finally{

   setLoadingId(null);

  }

 };

 /*
 =========================
 VERIFY OTP
 =========================
 */
 const verifyOTP = async (
  requestId
 )=>{

  try{

   setLoadingId(requestId);

   const user = JSON.parse(

    sessionStorage.getItem(
     "user"
    )

   );

   const res = await axios.post(

    `http://localhost:5000/api/requests/${requestId}/verify-work-otp`,

    {
     otp:
      otpInputs[requestId]
    },

    {
     headers:{
      Authorization:
       `Bearer ${user.token}`
     }
    }

   );

   alert(
    res.data.message
   );

   /*
   REMOVE COMPLETED WORK
   */
   setJobs(prev =>

    prev.filter(

     job =>
      job._id !== requestId

    )

   );

  }

  catch(error){

   console.log(error);

   alert(

    error.response?.data?.message ||

    "Invalid OTP"

   );

  }

  finally{

   setLoadingId(null);

  }

 };

 /*
 SHOW ONLY 2
 */
 const displayedJobs = showAll
  ? jobs
  : jobs.slice(0,2);

 return (

  <div className="bg-white p-5 rounded-xl shadow mb-6">

   <div className="flex justify-between items-center mb-4">

    <h2 className="font-semibold">
     Upcoming Work
    </h2>

    {!showAll && (

     <button

      onClick={()=>
       navigate("/upcoming-work")
      }

      className="text-blue-600 text-sm"

     >

      View All

     </button>

    )}

   </div>

   {displayedJobs.length === 0 ? (

    <p className="text-sm text-gray-500">

     No upcoming work

    </p>

   ) : (

    displayedJobs.map((job)=>(

     <div

      key={job._id}

      className="border rounded p-4 mb-4"

     >

      <p className="font-medium">

       {job.description}

      </p>

      <p className="text-sm text-gray-500">

       Client:{" "}

       {job.userId?.firstName}

      </p>

      <p className="text-sm text-gray-500">

       Budget: ₹{job.budget}

      </p>

      <p className="text-sm text-gray-500">

       Location: {job.location}

      </p>

      <p className="text-sm text-gray-500">

       Status:{" "}

       <span className="capitalize">

        {job.status}

       </span>

      </p>

      <p className="text-sm text-gray-500">

       Date:{" "}

       {new Date(
        job.createdAt
       ).toLocaleDateString()}

      </p>

      {/* SEND OTP */}
      <button

       onClick={()=>
        sendOTP(job._id)
       }

       disabled={
        loadingId === job._id
       }

       className="mt-3 w-full bg-green-600 text-white py-2 rounded"

      >

       {loadingId === job._id

        ? "Sending..."

        : "Send OTP"

       }

      </button>

      {/* OTP INPUT */}
      <input

       type="text"

       placeholder="Enter customer OTP"

       value={
        otpInputs[job._id] || ""
       }

       onChange={(e)=>

        setOtpInputs({

         ...otpInputs,

         [job._id]:
          e.target.value

        })

       }

       className="w-full border rounded px-3 py-2 mt-3 outline-none"

      />

      {/* VERIFY */}
      <button

       onClick={()=>
        verifyOTP(job._id)
       }

       disabled={
        loadingId === job._id
       }

       className="mt-2 w-full bg-blue-600 text-white py-2 rounded"

      >

       {loadingId === job._id

        ? "Verifying..."

        : "Complete Work"

       }

      </button>

     </div>

    ))

   )}

  </div>

 );

};

export default UpcomingWork;