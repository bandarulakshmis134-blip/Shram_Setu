import {
 useState,
 useEffect,
 useCallback
} from "react";

import axios from "axios";

import {
 useLocation
} from "react-router-dom";

import WorkerList from "../components/findWorkers/WorkerList";

import FilterSidebar from "../components/findWorkers/FilterSidebar";

import SearchBar from "../components/findWorkers/SearchBar";

const FindWorkers = ()=>{

 const [workers,setWorkers] =
  useState([]);

 const [loading,setLoading] =
  useState(false);

 /*
 =====================
 PANEL SWITCH
 =====================
 */
 const [
  activePanel,
  setActivePanel
 ] = useState("individual");

 /*
 =====================
 GET LOGGED IN USER
 =====================
 */
 const user = JSON.parse(

  sessionStorage.getItem(
   "user"
  ) || "null"

 );

 /*
 =====================
 GET URL PARAMS
 =====================
 */
 const locationHook =
  useLocation();

 /*
 =====================
 FETCH WORKERS
 =====================
 */
 const fetchWorkers =
  useCallback(

   async (filters={})=>{

    try{

     setLoading(true);

     const res =
      await axios.get(

       "http://localhost:5000/api/workers/search",

       {
        params:{

         ...filters,

         userId:user?._id,

         registrationType:
          activePanel

        }
       }

      );

     setWorkers(
      res.data || []
     );

    }

    catch(error){

     console.log(

      "Error fetching workers",

      error

     );

     setWorkers([]);

    }

    finally{

     setLoading(false);

    }

   },

   [
    user?._id,
    activePanel
   ]

 );

 /*
 =====================
 LOAD FROM HERO SEARCH
 =====================
 */
 useEffect(()=>{

  const params =
   new URLSearchParams(
    locationHook.search
   );

  const category =
   params.get("category") || "";

  const location =
   params.get("location") || "";

  const initialFilters = {};

  if(category){

   initialFilters.category =
    category;

  }

  if(location){

   initialFilters.location =
    location;

  }

  fetchWorkers(
   initialFilters
  );

 },[
   fetchWorkers,
   locationHook.search,
   activePanel
 ]);

 /*
 =====================
 UI
 =====================
 */
 return(

  <div className="flex gap-6 p-6 bg-gray-100 min-h-screen">

   {/* LEFT FILTER */}
   <div className="w-1/4">

    <FilterSidebar
     onApply={fetchWorkers}
    />

   </div>

   {/* RIGHT SIDE */}
   <div className="w-3/4">

    {/* TOP SWITCH */}
    <div className="flex justify-between items-center mb-4">

     <div className="bg-white rounded-lg shadow p-1 flex">

      {/* INDIVIDUAL */}
      <button

       onClick={() =>
        setActivePanel(
         "individual"
        )
       }

       className={`px-4 py-1 rounded transition ${
        activePanel ===
        "individual"

         ? "bg-blue-600 text-white"

         : "text-gray-700"
       }`}

      >

       Individual Workers

      </button>

      {/* GROUP */}
      <button

       onClick={() =>
        setActivePanel(
         "group"
        )
       }

       className={`px-4 py-1 rounded transition ${
        activePanel ===
        "group"

         ? "bg-blue-600 text-white"

         : "text-gray-700"
       }`}

      >

       Group Workers

      </button>

     </div>

    </div>

    {/* SEARCH BAR */}
    <SearchBar
     onSearch={fetchWorkers}
    />

    {/* WORKERS */}
    {loading

     ?

     <p className="mt-6">

      Loading workers...

     </p>

     :

     <WorkerList
      workers={workers}
     />

    }

   </div>

  </div>

 );

};

export default FindWorkers;