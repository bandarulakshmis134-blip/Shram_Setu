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

 const [otpInputs,setOtpInputs] =
  useState({});

 const [loadingId,setLoadingId] =
  useState(null);

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

   /*
   START WITH REAL REQUESTS
   */
   const mergedJobs = [

    ...(requests || []).map(

     (request)=>({

      _id:
       request._id,

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

   /*
   ADD SCHEDULE WORKS
   ONLY IF MISSING
   */
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

      _id:
       schedule._id,

      description:
       schedule.title,

      client:
       "Client",

      budget:
       schedule?.job?.budget ||

       0,

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
 OPEN / CREATE INVOICE
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

   /*
   TRY FETCH EXISTING
   */
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

    /*
    IF NOT 404
    */
    if(

     fetchError.response?.status
     !== 404

    ){

     throw fetchError;

    }

   }

   /*
   CREATE NEW INVOICE
   */
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
 SHOW ONLY 2
 */
 const displayedJobs = showAll
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

        </div>

        {/* INVOICE ICON */}
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

         : "Send OTP"

        }

       </button>

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

         : "Complete Work"

        }

       </button>

      </div>

     ))

    )}

   </div>

   {/* INVOICE MODAL */}
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