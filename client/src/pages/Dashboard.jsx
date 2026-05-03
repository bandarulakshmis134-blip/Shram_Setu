import {
 FaUsers,
 FaClock,
 FaCheckCircle,
 FaChartLine,
 FaCalendarAlt
} from "react-icons/fa";

import StatCard from "../components/dashboard/StatCard";
import ApplicationCard from "../components/dashboard/ApplicationCard";
import RequestRow from "../components/dashboard/RequestRow";
import Calendar from "../components/dashboard/Calendar";


const Dashboard = () => {

    const activeJobs = 0;
    const completedJobs = 0;
    const totalWorkersHired = activeJobs + completedJobs;

 return(

  <div className="min-h-screen bg-gray-100 p-6">


   {/* header */}

   <div className="flex justify-between items-center mb-6">

    <h1 className="text-2xl font-bold">
     Dashboard
    </h1>


    <div className="flex bg-gray-200 rounded-lg p-1">

     <button className="px-4 py-1 bg-white rounded-md shadow text-sm font-medium">
      Client / Admin Panel
     </button>

     <button className="px-4 py-1 text-sm text-gray-600">
      Worker Panel
     </button>

    </div>

   </div>



   {/* stat cards */}

   <div className="grid md:grid-cols-3 gap-4 mb-6">

    <StatCard
     title="Total Workers Hired"
     value={totalWorkersHired}
     icon={<FaUsers className="text-blue-500"/>}
    />

    <StatCard
     title="Active Jobs"
     value={activeJobs}
     icon={<FaClock className="text-yellow-500"/>}
    />

    <StatCard
     title="Completed"
     value={completedJobs}
     icon={<FaCheckCircle className="text-green-500"/>}
    />


   </div>



   {/* middle section */}

   <div className="grid md:grid-cols-3 gap-6">


    <div className="md:col-span-2 bg-white rounded-xl shadow p-4">

     <h2 className="font-semibold mb-4">
      New Job Applications (Admin)
     </h2>


     <ApplicationCard
      name="Suresh Patel"
      job="Carpenter Job"
     />


     <ApplicationCard
      name="Vikram Das"
      job="Appliance Repair"
     />

    </div>



    <div className="bg-white rounded-xl shadow p-4">

     <h2 className="font-semibold mb-4 flex items-center gap-2">

      <FaCalendarAlt/>

      Calendar

     </h2>


     <Calendar/>

    </div>


   </div>



   {/* table */}

   <div className="mt-6 bg-white rounded-xl shadow p-4">

    <div className="flex justify-between mb-4">

     <h2 className="font-semibold">
      Active Requests
     </h2>

     <button className="text-blue-600 text-sm">
      View All
     </button>

    </div>


    <table className="w-full text-sm">

     <thead>

      <tr className="text-gray-500">

       <th className="text-left pb-2">
        Worker
       </th>

       <th className="text-left pb-2">
        Service
       </th>

       <th className="text-left pb-2">
        Date
       </th>

       <th className="text-left pb-2">
        Status
       </th>

       <th className="text-left pb-2">
        Action
       </th>

      </tr>

     </thead>


     <tbody>

      <RequestRow
       worker="Ravi Kumar"
       service="Construction Workers"
       date="13 Feb, 2026"
       status="progress"
      />

      <RequestRow
       worker="Priya Sharma"
       service="Housekeepers / Cleaners"
       date="12 Feb, 2026"
       status="completed"
      />

     </tbody>

    </table>

   </div>


  </div>

 );

};

export default Dashboard;