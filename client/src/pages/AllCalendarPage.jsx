import {
 ArrowLeft
} from "lucide-react";

import {
 useNavigate,
 useLocation
} from "react-router-dom";

import CalendarCard from "../components/dashboard/CalendarCard";

const AllCalendarPage = ()=>{

 const navigate =
  useNavigate();

 const location =
  useLocation();

 const isWorker =
  location.state?.isWorker;

 return(

  <div className="min-h-screen bg-gray-100 p-6">

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

   <CalendarCard

    isWorker={isWorker}

    showAll={true}

   />

  </div>

 );

};

export default AllCalendarPage;