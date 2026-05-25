import { useEffect, useState } from "react";
import axios from "../axiosInstance";

import { useNavigate } from "react-router-dom";

import WorkerProfileModal from "../WorkerProfileModal";

const Applications = ({
 showAll = false
}) => {

 const [apps, setApps] = useState([]);

 const [selectedApp, setSelectedApp] =
  useState(null);

 const navigate = useNavigate();

 /*
 ========================
 FETCH APPLICATIONS
 ========================
 */
 useEffect(() => {

  const fetchApps = async () => {

   try {

    const user = JSON.parse(
     sessionStorage.getItem("user")
    );

    const res = await axios.get(
     `${import.meta.env.VITE_API_URL}/api/applications/admin`,
     {
      headers: {
       Authorization: `Bearer ${user.token}`
      }
     }
    );

    setApps(res.data || []);

   }

   catch (error) {

    console.log(error);

    setApps([]);

   }

  };

  fetchApps();

 }, []);

 /*
 ========================
 UPDATE STATUS
 ========================
 */
 const updateStatus = async (
  id,
  status
 ) => {

  try {

   const user = JSON.parse(
    sessionStorage.getItem("user")
   );

   await axios.put(
    `${import.meta.env.VITE_API_URL}/api/applications/${id}/status`,
    { status },
    {
     headers: {
      Authorization: `Bearer ${user.token}`
     }
    }
   );

   /*
   UPDATE UI
   */
   setApps((prev) =>
    prev.map((app) =>
     app._id === id
      ? { ...app, status }
      : app
    )
   );

  }

  catch (error) {

   console.log(error);

  }

 };

 /*
 ========================
 SHOW ONLY 2 IN DASHBOARD
 ========================
 */
 const displayedApps = showAll
  ? apps
  : apps.slice(0,2);

 return (

  <div className="bg-white p-5 rounded-xl shadow">

   <div className="flex justify-between items-center mb-4">

    <h2 className="font-semibold">

     New Job Applications

    </h2>

    {!showAll && (

     <button
      onClick={() =>
       navigate("/all-applications")
      }
      className="text-blue-600 text-sm"
     >

      View All

     </button>

    )}

   </div>

   {displayedApps.length === 0 ? (

    <p className="text-gray-500 text-sm">

     No applications yet

    </p>

   ) : (

    displayedApps.map((app) => (

     <div
      key={app._id}
      className="border-b py-4"
     >

      <p className="font-medium">

       {app?.worker?.firstName}

      </p>

      <p className="text-sm text-gray-500">

       Applied for:
       {" "}
       {app?.job?.title}

      </p>

      <p className="text-xs mt-1 capitalize text-gray-400">

       Status:
       {" "}
       {app?.status}

      </p>

      {/* ACTIONS */}
      {app?.status === "pending" && (

       <div className="flex gap-2 mt-3">

        {/* REVIEW */}
        <button
         onClick={() =>
          setSelectedApp(app)
         }
         className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100"
        >

         Review

        </button>

        {/* ACCEPT */}
        <button
         onClick={() =>
          updateStatus(
           app._id,
           "accepted"
          )
         }
         className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
        >

         Accept

        </button>

        {/* REJECT */}
        <button
         onClick={() =>
          updateStatus(
           app._id,
           "rejected"
          )
         }
         className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
        >

         Reject

        </button>

       </div>

      )}

     </div>

    ))

   )}

   {/* WORKER PROFILE MODAL */}
   {selectedApp && (

    <WorkerProfileModal
     worker={selectedApp?.worker}
     onClose={() =>
      setSelectedApp(null)
     }
    />

   )}

  </div>

 );

};

export default Applications;