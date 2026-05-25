import { useState } from "react";
import axios from "axios";

const RequestModal = ({ worker, onClose }) => {

 const [form,setForm] = useState({

  description:"",
  location:"",
  budget:"",
  urgency:"Flexible"

 });


 const handleChange = (e)=>{

  setForm({

   ...form,
   [e.target.name]:e.target.value

  });

 };


 const setUrgency = (level)=>{

  setForm({

   ...form,
   urgency:level

  });

 };


 /*
 SUBMIT REQUEST
 */

 const submitRequest = async()=>{

  try{

   const storedUser = sessionStorage.getItem("user");

   if(!storedUser){

    alert("Please login first");

    return;

   }

   const user = JSON.parse(storedUser);


   if(!form.description || !form.location || !form.budget){

    alert("Please fill all required fields");

    return;

   }


   const res = await axios.post(

    `${import.meta.env.VITE_API_URL}/api/requests/create`,

    {

     userId:user._id,

     workerId:worker.userId || worker._id,

     description:form.description,

     location:form.location,

     budget:Number(form.budget),

     urgency:form.urgency

    }

   );


   console.log("Saved:",res.data);

   alert("Request Sent");

   onClose();

  }

  catch(error){

   console.log("ERROR:",error.response?.data || error.message);

   alert("Error sending request");

  }

 };


 /*
 URGENCY COLORS
 */

 const urgencyStyle = (level)=>{

  if(form.urgency !== level){

   return "bg-gray-100 text-gray-700 border-gray-200";

  }

  if(level==="Flexible"){

   return "bg-green-100 text-green-700 border-green-300";

  }

  if(level==="24 Hours"){

   return "bg-yellow-100 text-yellow-700 border-yellow-300";

  }

  if(level==="Urgent"){

   return "bg-red-100 text-red-700 border-red-300";

  }

 };


 return(

  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">


   <div className="bg-white w-420px rounded-xl shadow-lg border border-gray-200 relative">


    {/* HEADER */}

    <div className="p-5 border-b border-gray-200">


     <div className="flex items-center gap-3">


      {worker.profilePic ? (

       <img

        src={worker.profilePic}

        className="w-10 h-10 rounded-full object-cover"

       />

      ) : (

       <div className="w-10 h-10 bg-gray-200 rounded-full"/>

      )}


      <div>

       <h2 className="font-semibold text-gray-800">

        {worker.firstName || worker.groupName}

       </h2>


       <p className="text-xs text-gray-500">

        {worker.skills?.[0]} • SS-{worker._id.slice(-4)}

       </p>

      </div>


     </div>


    </div>



    {/* BODY */}

    <div className="p-5 space-y-3">


     <div>

      <label className="text-sm font-medium">

       Job Description *

      </label>


      <textarea

       name="description"

       value={form.description}

       onChange={handleChange}

       placeholder="Describe the work..."

       className="w-full mt-1 border border-gray-300 rounded-lg p-2 h-16 text-sm"

      />

     </div>



     <div>

      <label className="text-sm font-medium">

       Location *

      </label>


      <input

       name="location"

       value={form.location}

       onChange={handleChange}

       placeholder="Enter work location"

       className="w-full mt-1 border border-gray-300 rounded-lg p-2 text-sm"

      />

     </div>



     <div>

      <label className="text-sm font-medium">

       Budget *

      </label>


      <input

       type="number"

       name="budget"

       value={form.budget}

       onChange={handleChange}

       placeholder="Enter budget"

       className="w-full mt-1 border border-gray-300 rounded-lg p-2 text-sm"

      />

     </div>



     <div>

      <p className="text-sm font-medium mb-1">

       Urgency Level

      </p>


      <div className="grid grid-cols-3 gap-2">


       <button

        onClick={()=>setUrgency("Flexible")}

        className={`border rounded-lg py-2 text-xs ${urgencyStyle("Flexible")}`}

       >

        Flexible

       </button>


       <button

        onClick={()=>setUrgency("24 Hours")}

        className={`border rounded-lg py-2 text-xs ${urgencyStyle("24 Hours")}`}

       >

        24 Hours

       </button>


       <button

        onClick={()=>setUrgency("Urgent")}

        className={`border rounded-lg py-2 text-xs ${urgencyStyle("Urgent")}`}

       >

        Urgent

       </button>


      </div>


     </div>


    </div>



    {/* FOOTER */}

    <div className="p-5 border-t border-gray-200">


     <button

      onClick={submitRequest}

      className="w-full bg-blue-600 text-white py-2 rounded-lg"

     >

      Confirm Request

     </button>


    </div>



    {/* CLOSE */}

    <button

     onClick={onClose}

     className="absolute top-2 right-3 text-gray-400 text-lg"

    >

     ×

    </button>


   </div>


  </div>

 );

};

export default RequestModal;