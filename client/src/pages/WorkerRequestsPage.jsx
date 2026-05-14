import { useNavigate } from "react-router-dom";

import {
 ArrowLeft
} from "lucide-react";

import WorkerRequests from "../components/dashboard/WorkerRequests";

const WorkerRequestsPage = () => {

 const navigate = useNavigate();

 return (

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

   <WorkerRequests showAll={true}/>

  </div>

 );

};

export default WorkerRequestsPage;