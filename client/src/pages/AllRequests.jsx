import { useEffect, useState } from "react";

import axios from "axios";

import {
 useNavigate
} from "react-router-dom";

import {
 ArrowLeft
} from "lucide-react";

import InvoiceModal from "../components/dashboard/InvoiceModal";

const AllRequests = () => {

 const [requests,setRequests] =
  useState([]);

 const [
  selectedInvoice,
  setSelectedInvoice
 ] = useState(null);

 const navigate = useNavigate();

 /*
 FETCH REQUESTS
 */
 const fetchRequests = async ()=>{

  try{

   const user = JSON.parse(
    sessionStorage.getItem("user")
   );

   const res = await axios.get(

    "http://localhost:5000/api/requests/user",

    {
     headers:{
      Authorization:
       `Bearer ${user.token}`
     }
    }

   );

   setRequests(res.data || []);

  }

  catch(error){

   console.log(error);

  }

 };

 /*
 LOAD REQUESTS
 */
 useEffect(()=>{

  const loadRequests = async ()=>{

   await fetchRequests();

  };

  loadRequests();

 },[]);

 /*
 STATUS COLORS
 */
 const getStatusStyle = (status)=>{

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
 ACTION BUTTON TEXT
 */
 const getAction = (request)=>{

  switch(request.status){

   case "completed":
    return "Rebook";

   case "accepted":
   case "in-progress":
    return "Bill";

   default:
    return "Message";

  }

 };

 /*
 OPEN BILL
 */
 const handleBill = async (
  request
 )=>{

  try{

   const user = JSON.parse(
    sessionStorage.getItem("user")
   );

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
 BUTTON CLICK
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

 };

 return(

  <>

   <div className="p-6 bg-gray-100 min-h-screen">

    {/* BACK BUTTON */}
    <button

     onClick={()=>navigate(-1)}

     className="flex items-center gap-2 mb-4 text-gray-700 hover:text-blue-600 transition"

    >

     <ArrowLeft size={22}/>

     <span className="font-medium">

      Back

     </span>

    </button>

    <div className="bg-white rounded-xl shadow p-5">

     <h2 className="font-semibold text-lg mb-4">
      All Requests
     </h2>

     {requests.length === 0 ? (

      <p className="text-gray-500 text-sm">
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

        {requests.map((r)=>(

         <tr
          key={r._id}
          className="border-t"
         >

          <td className="py-3">

           {r.workerId?.firstName}

          </td>

          <td>

           {r.workerId?.skills?.[0] ||
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

            {r.status}

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

export default AllRequests;