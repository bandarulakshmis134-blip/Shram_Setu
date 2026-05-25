import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyApplications = ({
 showAll = false
}) => {

 const [apps, setApps] = useState([]);

 const navigate = useNavigate();

 /*
 =========================
 FETCH APPLICATIONS
 =========================
 */
 useEffect(() => {

  const fetchApps = async () => {

   try {

    const user = JSON.parse(
     sessionStorage.getItem("user")
    );

    const res = await axios.get(
     `${import.meta.env.VITE_API_URL}/api/applications/worker`,
     {
      headers: {
       Authorization: `Bearer ${user.token}`
      }
     }
    );

    setApps(res.data || []);

   }

   catch (error) {

    console.log(
     "APPLICATION ERROR:",
     error
    );

    setApps([]);

   }

  };

  fetchApps();

 }, []);

 /*
 =========================
 DELETE APPLICATION
 =========================
 */
 const handleDelete = async (id) => {

  try {

   const user = JSON.parse(
    sessionStorage.getItem("user")
   );

   await axios.delete(
    `${import.meta.env.VITE_API_URL}/api/applications/${id}`,
    {
     headers: {
      Authorization: `Bearer ${user.token}`
     }
    }
   );

   /*
   REMOVE FROM UI
   */
   setApps((prevApps) =>
    prevApps.filter(
     (app) => app._id !== id
    )
   );

  }

  catch (error) {

   console.log(
    "DELETE ERROR:",
    error
   );

   alert(
    "Failed to delete application"
   );

  }

 };

 /*
 =========================
 SHOW ONLY 2 IN DASHBOARD
 =========================
 */
 const displayedApps = showAll
  ? apps
  : apps.slice(0,2);

 return (

  <div className="bg-white p-5 rounded-xl shadow">

   <div className="flex justify-between items-center mb-4">

    <h2 className="font-semibold">
     Jobs You Applied
    </h2>

    {!showAll && (

     <button
      onClick={()=>
       navigate("/my-applications")
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
      className="border-b py-3 flex items-center justify-between"
     >

      <div>

       <p className="font-medium">
        {app?.job?.title ||
         "Job unavailable"}
       </p>

       <p className="text-sm text-gray-500">
        Status:{" "}
        {app?.status || "pending"}
       </p>

      </div>

      {/* DELETE ICON */}
      {app?.status !== "accepted" && (

       <button
        onClick={() =>
         handleDelete(app._id)
        }
        className="p-2 rounded-lg hover:bg-red-50"
       >

        <Trash2
         size={18}
         className="text-red-500"
        />

       </button>

      )}

     </div>

    ))

   )}

  </div>

 );

};

export default MyApplications;