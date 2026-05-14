import MyApplications from "../components/dashboard/MyApplications";

import {
 ArrowLeft
} from "lucide-react";

import {
 useNavigate
} from "react-router-dom";

const MyApplicationsPage = () => {

 const navigate =
  useNavigate();

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

   <MyApplications showAll={true}/>

  </div>

 );

};

export default MyApplicationsPage;