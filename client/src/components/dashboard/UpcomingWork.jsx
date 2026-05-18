import {
 useEffect,
 useState
} from "react";

import axios from "axios";

import {
 useNavigate
} from "react-router-dom";

import {
 Receipt
} from "lucide-react";

import InvoiceModal from "./InvoiceModal";

const UpcomingWork = ({
 showAll = false
}) => {

 const navigate =
  useNavigate();

 const [jobs,setJobs] =
  useState([]);

 /*
 =========================
 OTP FLOW STATES
 =========================
 */
 const [otpInputs,setOtpInputs] =
  useState({});

 const [otpSent,setOtpSent] =
  useState({});

 const [loadingId,setLoadingId] =
  useState(null);

 /*
 =========================
 OTP TIMER
 =========================
 */
 const [timers,setTimers] =
  useState({});

 const [canResend,setCanResend] =
  useState({});

 const [
  selectedInvoice,
  setSelectedInvoice
 ] = useState(null);

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

   /*
   FETCH SCHEDULES
   */
   const scheduleRes =
    await axios.get(

     "http://localhost:5000/api/schedules/worker",

     {
      headers:{
       Authorization:
        `Bearer ${user.token}`
      }
     }

    );

   /*
   FETCH REQUESTS
   */
   const requestRes =
    await axios.get(

     "http://localhost:5000/api/requests/worker-history",

     {
      headers:{
       Authorization:
        `Bearer ${user.token}`
      }
     }

    );

   const requests =
    requestRes.data || [];

   const mergedJobs = [

    ...(requests || []).map(

     (request)=>({

      _id:request._id,

      description:
       request.description,

      client:
       request.userId?.firstName ||

       "Client",

      budget:
       request.budget || 0,

      location:
       request.location ||

       "Not specified",

      status:
       request.status ||

       "accepted",

      createdAt:
       request.createdAt,

      requestId:
       request._id

     })

    )

   ];

   (scheduleRes.data || [])

   .forEach((schedule)=>{

    const alreadyExists =

     mergedJobs.find(

      (job)=>

       job.requestId ===
       schedule.requestId

     );

    if(!alreadyExists){

     mergedJobs.push({

      _id:schedule._id,

      description:
       schedule.title,

      client:"Client",

      budget:
       schedule?.job?.budget || 0,

      location:
       schedule?.job?.location ||

       "Not specified",

      status:"accepted",

      createdAt:
       schedule.createdAt,

      requestId:
       schedule.requestId

     });

    }

   });

   setJobs(mergedJobs);

  }

  catch(error){

   console.log(error);

   setJobs([]);

  }

 };

 /*
 =========================
 LOAD
 =========================
 */
 useEffect(()=>{

  fetchUpcomingWork();

 },[]);

 /*
 =========================
 TIMER EFFECT
 =========================
 */
 useEffect(()=>{

  const interval =
   setInterval(()=>{

    setTimers((prev)=>{

     const updated = {

      ...prev

     };

     Object.keys(updated)
     .forEach((id)=>{

      if(updated[id] > 0){

       updated[id] -= 1;

      }

     });

     return updated;

    });

   },1000);

  return ()=> clearInterval(interval);

 },[]);

 /*
 =========================
 ENABLE RESEND
 =========================
 */
 useEffect(()=>{

  Object.keys(timers)
  .forEach((id)=>{

   if(timers[id] === 0){

    setCanResend(prev=>({

     ...prev,

     [id]:true

    }));

   }

  });

 },[timers]);

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

   /*
   OTP FLOW
   */
   setOtpSent(prev=>({

    ...prev,

    [requestId]:true

   }));

   /*
   START TIMER
   */
   setTimers(prev=>({

    ...prev,

    [requestId]:120

   }));

   setCanResend(prev=>({

    ...prev,

    [requestId]:false

   }));

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
   REMOVE COMPLETED
   */
   setJobs(prev =>

    prev.filter(

     job =>
      job.requestId !== requestId

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
 =========================
 OPEN INVOICE
 =========================
 */
 const openInvoice = async (
  requestId,
  amount
 )=>{

  try{

   const user = JSON.parse(

    sessionStorage.getItem(
     "user"
    )

   );

   try{

    const existing =
     await axios.get(

      `http://localhost:5000/api/invoices/request/${requestId}`,

      {
       headers:{
        Authorization:
         `Bearer ${user.token}`
       }
      }

     );

    setSelectedInvoice(
     existing.data
    );

    return;

   }

   catch(fetchError){

    if(

     fetchError.response?.status
     !== 404

    ){

     throw fetchError;

    }

   }

   const created =
    await axios.post(

     "http://localhost:5000/api/invoices/create",

     {
      requestId,
      amount
     },

     {
      headers:{
       Authorization:
        `Bearer ${user.token}`
      }
     }

    );

   setSelectedInvoice(
    created.data
   );

  }

  catch(error){

   console.log(error);

   alert(
    "Failed to open invoice"
   );

  }

 };

 /*
 SHOW LIMITED
 */
 const displayedJobs =
  showAll
   ? jobs
   : jobs.slice(0,2);

 return (

  <>

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

       <div className="flex items-start justify-between">

        <div>

         <p className="font-medium">

          {job.description}

         </p>

         <p className="text-sm text-gray-500">

          Client: {job.client}

         </p>

        </div>

        <button

         onClick={()=>
          openInvoice(
           job.requestId,
           job.budget
          )
         }

         className="p-2 rounded-lg hover:bg-gray-100 transition"

        >

         <Receipt
          size={20}
          className="text-blue-600"
         />

        </button>

       </div>

       {!otpSent[job.requestId] ? (

        <button

         onClick={()=>
          sendOTP(
           job.requestId
          )
         }

         disabled={
          loadingId ===
          job.requestId
         }

         className="mt-3 w-full bg-green-600 text-white py-2 rounded"

        >

         {loadingId ===
          job.requestId

          ? "Sending..."

          : "Send OTP"}

        </button>

       ) : (

        <>

         <input

          type="text"

          placeholder="Enter customer OTP"

          value={
           otpInputs[
            job.requestId
           ] || ""
          }

          onChange={(e)=>

           setOtpInputs({

            ...otpInputs,

            [job.requestId]:
             e.target.value

           })

          }

          className="w-full border rounded px-3 py-2 mt-3 outline-none"

         />

         <button

          onClick={()=>
           verifyOTP(
            job.requestId
           )
          }

          disabled={
           loadingId ===
           job.requestId
          }

          className="mt-2 w-full bg-blue-600 text-white py-2 rounded"

         >

          {loadingId ===
           job.requestId

           ? "Verifying..."

           : "Verify OTP"}

         </button>

         <div className="text-center mt-3">

          <p className="text-sm text-gray-500">

           OTP expires in:

           <span className="font-semibold text-red-500 ml-1">

            {Math.floor(

             (timers[
              job.requestId
             ] || 0) / 60

            )}

            :

            {((timers[
              job.requestId
             ] || 0) % 60)

             .toString()

             .padStart(2,"0")}

           </span>

          </p>

          <button

           disabled={
            !canResend[
             job.requestId
            ]
           }

           onClick={()=>
            sendOTP(
             job.requestId
            )
           }

           className={`mt-2 text-sm font-medium

           ${canResend[
             job.requestId
            ]

             ? "text-blue-600"

             : "text-gray-400 cursor-not-allowed"

           }`}

          >

           Resend OTP

          </button>

         </div>

        </>

       )}

      </div>

     ))

    )}

   </div>

   {selectedInvoice && (

    <InvoiceModal

     invoice={selectedInvoice}

     onClose={()=>
      setSelectedInvoice(null)
     }

    />

   )}

  </>

 );

};

export default UpcomingWork;