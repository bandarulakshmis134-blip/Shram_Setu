import {
 useEffect,
 useState,
 useCallback
} from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import InvoiceModal from "./InvoiceModal";

import RatingModal from "./RatingModal";

import RequestModal from "../findWorkers/RequestModal";

const ActiveRequests = ({
 showAll = false
}) => {

 const [requests,setRequests] =
  useState([]);

 const [
  selectedInvoice,
  setSelectedInvoice
 ] = useState(null);

 const [
 showRebookModal,
 setShowRebookModal
] = useState(false);

 const [
 showRating,
 setShowRating
] = useState(false);

const [
 selectedRequest,
 setSelectedRequest
] = useState(null);

 const navigate = useNavigate();

 /*
 =========================
 GET LOGGED USER
 =========================
 */
 const getUser = ()=>{

  return JSON.parse(
   sessionStorage.getItem("user")
  );

 };

 /*
 =========================
 FETCH REQUESTS
 =========================
 */
 const fetchRequests =
  useCallback(async ()=>{

  try{

   const user = getUser();

   /*
   NORMAL REQUESTS
   */
   const requestRes =
    await axios.get(

     "http://localhost:5000/api/requests/user",

     {
      headers:{
       Authorization:
        `Bearer ${user.token}`
      }
     }

    );

   /*
   ADMIN SCHEDULES
   */
   const scheduleRes =
    await axios.get(

     "http://localhost:5000/api/schedules/admin",

     {
      headers:{
       Authorization:
        `Bearer ${user.token}`
      }
     }

    );

   const normalRequests =
    requestRes.data || [];

   const schedules =
    scheduleRes.data || [];

   /*
   MERGE ACCEPTED JOB WORKS
   */
   const mergedScheduleRequests =

    schedules.map((schedule)=>{

     const matchedRequest =

      normalRequests.find(

       (request)=>

        request._id ===
        schedule.requestId

      );

     /*
     USE REAL REQUEST
     */
     if(matchedRequest){

      return matchedRequest;

     }

     /*
     FALLBACK
     */
     return {

      _id:
       schedule._id,

      workerId:{
       firstName:"Worker",
       skills:[]
      },

      /*
      SERVICE FROM
      POST JOB FORM
      */
      service:

       schedule?.job?.title ||

       schedule?.job?.category ||

       "Service",

      createdAt:
       schedule.createdAt,

      status:"accepted",

      budget:
       schedule?.job?.budget ||

       0

     };

    });

   /*
   REMOVE DUPLICATES
   */
   const uniqueRequests = [

    ...normalRequests,

    ...mergedScheduleRequests

   ].filter(

    (request,index,self)=>

     index ===

     self.findIndex(

      (r)=>

       r._id === request._id

     )

   );

   setRequests(
    uniqueRequests
   );

  }

  catch(error){

   console.log(
    "REQUEST FETCH ERROR:",
    error
   );

  }

 },[]);

 /*
 =========================
 INITIAL LOAD
 =========================
 */
 useEffect(()=>{

  const loadRequests = async ()=>{

   await fetchRequests();

  };

  loadRequests();

 },[fetchRequests]);

 /*
 =========================
 OPEN BILL / INVOICE
 =========================
 */
 const handleBill = async (
  request
 )=>{

  try{

   const user = getUser();

   const res = await axios.post(

    "http://localhost:5000/api/invoices/create",

    {
     requestId:request._id,

     amount:
      request.budget || 1000
    },

    {
     headers:{
      Authorization:
       `Bearer ${user.token}`
     }
    }

   );

   setSelectedInvoice(
    res.data
   );

  }

  catch(error){

   console.log(
    "INVOICE ERROR:",
    error
   );

  }

 };

 /*
 =========================
 STATUS COLORS
 =========================
 */
 const getStatusStyle = (
  status
 )=>{

  switch(status){

   case "completed":
    return "bg-green-100 text-green-600";

   case "rejected":
    return "bg-red-100 text-red-600";

   case "accepted":
   case "in-progress":
    return "bg-blue-100 text-blue-600";

   default:
    return "bg-yellow-100 text-yellow-600";

  }

 };

 /*
 =========================
 ACTION BUTTON
 =========================
 */
const getAction = (
 request
)=>{

 /*
 =========================
 ALREADY RATED
 =========================
 */
 if(

  request.status === "completed" &&

  request.isRated

 ){

  return "Rebook";

 }

 switch(request.status){

  case "completed":
   return "Rating";

  case "accepted":
  case "in-progress":
   return "Bill";

  default:
   return "Message";

 }

};
 /*
 =========================
 BUTTON CLICK
 =========================
 */
 const handleAction = (
  request
 )=>{

  const action =
   getAction(request);

  /*
  MESSAGE
  */
  if(action === "Message"){

   navigate("/messages",{

    state:{

     user:{

      _id:
       request.workerId?._id,

      name:
       request.workerId?.firstName

     }

    }

   });

  }

  /*
  BILL
  */
  else if(action === "Bill"){

   handleBill(request);

  }

/*
=========================
RATING
=========================
*/
else if(action === "Rating"){

 setSelectedRequest(
  request
 );

 setShowRating(true);

}

/*
=========================
REBOOK
=========================
*/
else if(action === "Rebook"){

 setSelectedRequest(
  request
 );

 setShowRebookModal(
  true
 );

}

 };

 /*
=========================
SUBMIT RATING
=========================
*/
/*
=========================
SUBMIT RATING
=========================
*/
const handleRatingSubmit = async (
 rating
)=>{

 try{

  const user = JSON.parse(

   sessionStorage.getItem(
    "user"
   )

  );

  await axios.post(

   `http://localhost:5000/api/requests/${selectedRequest._id}/rate`,

   {
    stars:rating
   },

   {
    headers:{
     Authorization:
      `Bearer ${user.token}`
    }
   }

  );

  alert(
   "Rating submitted successfully"
  );

  /*
UPDATE UI
*/
setRequests((prev)=>

 prev.map((request)=>

  request._id ===
  selectedRequest._id

   ? {

      ...request,

      isRated:true

     }

   : request

 )

);

setShowRating(false);

setSelectedRequest(null);

 }

 catch(error){

  console.log(error);

  alert(

   error.response?.data?.message ||

   "Failed to submit rating"

  );

 }

};

 /*
 =========================
 SHOW ONLY 2 IN DASHBOARD
 =========================
 */
 const displayedRequests =
  showAll
   ? requests
   : requests.slice(0,2);

 return (

  <>

   <div className="bg-white p-5 rounded-xl shadow mt-6">

    <div className="flex justify-between items-center mb-4">

     <h2 className="font-semibold">
      Active Requests
     </h2>

     {!showAll && (

      <button
       onClick={()=>
        navigate("/all-requests")
       }
       className="text-blue-600 text-sm"
      >

       View All

      </button>

     )}

    </div>

    {displayedRequests.length === 0 ? (

     <p className="text-sm text-gray-500">
      No requests found
     </p>

    ) : (

     <table className="w-full text-sm">

      <thead className="text-gray-500">

       <tr>

        <th className="text-left">
         Worker
        </th>

        <th className="text-left">
         Service
        </th>

        <th className="text-left">
         Date
        </th>

        <th className="text-left">
         Status
        </th>

        <th className="text-left">
         Action
        </th>

       </tr>

      </thead>

      <tbody>

       {displayedRequests.map((r) => (

        <tr
         key={r._id}
         className="border-t"
        >

         <td className="py-3">

          {r.workerId?.firstName}

         </td>

         <td>

          {r.service ||

           r.workerId?.skills?.[0] ||

           "Service"}

         </td>

         <td>

          {new Date(
           r.createdAt
          ).toLocaleDateString()}

         </td>

         <td>

          <span
           className={`px-2 py-1 rounded text-xs capitalize ${getStatusStyle(r.status)}`}
          >

           {r.status === "accepted"
            ? "In Progress"
            : r.status
           }

          </span>

         </td>

         <td>

          <button

           onClick={()=>
            handleAction(r)
           }

           className="text-blue-600"

          >

           {getAction(r)}

          </button>

         </td>

        </tr>

       ))}

      </tbody>

     </table>

    )}

   </div>

   {/* RATING MODAL */}
<RatingModal

 isOpen={showRating}

 onClose={()=>{

  setShowRating(false);

  setSelectedRequest(null);

 }}

 onSubmit={
  handleRatingSubmit
 }

/>

{/*
=========================
REBOOK MODAL
=========================
*/}
{showRebookModal &&
 selectedRequest && (

 <RequestModal

  worker={{

   _id:
    selectedRequest.workerId?._id,

   firstName:
    selectedRequest.workerId?.firstName,

   skills:
    selectedRequest.workerId?.skills

  }}

  onClose={()=>{

   setShowRebookModal(
    false
   );

   setSelectedRequest(
    null
   );

  }}

 />

)}

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

export default ActiveRequests;