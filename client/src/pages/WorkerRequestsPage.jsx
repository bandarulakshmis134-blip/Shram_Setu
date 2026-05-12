import { useNavigate } from "react-router-dom";

import {
 ArrowLeft
} from "lucide-react";

import WorkerRequests from "../components/dashboard/WorkerRequests";

const WorkerRequestsPage = () => {

 const navigate = useNavigate();

 return (

  <div className="min-h-screen bg-gray-100 p-6">

   {/* TOP */}
   <div className="flex items-center gap-3 mb-5">

    <button
     onClick={() => navigate(-1)}
     className="p-2 rounded-lg bg-white shadow hover:bg-gray-100"
    >

     <ArrowLeft size={18} />

    </button>

    <h1 className="text-2xl font-bold">
     Incoming Requests
    </h1>

   </div>

   <WorkerRequests showAll={true}/>

  </div>

 );

};

export default WorkerRequestsPage;