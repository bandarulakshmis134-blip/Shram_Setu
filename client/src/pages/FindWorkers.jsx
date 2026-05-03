import { useState,useEffect,useCallback } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import WorkerList from "../components/findWorkers/WorkerList";
import FilterSidebar from "../components/findWorkers/FilterSidebar";
import SearchBar from "../components/findWorkers/SearchBar";


const FindWorkers = ()=>{

 const [workers,setWorkers] = useState([]);
 const [loading,setLoading] = useState(false);

 /*
 =====================
 GET LOGGED IN USER
 =====================
 */
 const user = JSON.parse(
  sessionStorage.getItem("user") || "null"
 );

 /*
 =====================
 GET URL PARAMS (from Hero)
 =====================
 */
 const locationHook = useLocation();


 /*
 =====================
 FETCH WORKERS
 =====================
 */
 const fetchWorkers = useCallback(

  async (filters={})=>{

   try{

    setLoading(true);

    const res = await axios.get(
     "http://localhost:5000/api/workers/search",
     {
      params:{
       ...filters,
       userId:user?._id
      }
     }
    );

    setWorkers(res.data || []);

   }

   catch(error){

    console.log("Error fetching workers",error);
    setWorkers([]);

   }

   finally{

    setLoading(false);

   }

  },

  [user?._id]

 );


 /*
 =====================
 LOAD FROM HERO SEARCH (URL)
 =====================
 */
 useEffect(()=>{

  const params = new URLSearchParams(locationHook.search);

  const category = params.get("category") || "";
  const location = params.get("location") || "";

  const initialFilters = {};

  if(category){
   initialFilters.category = category;
  }

  if(location){
   initialFilters.location = location;
  }

  fetchWorkers(initialFilters);

 },[fetchWorkers,locationHook.search]);


 /*
 =====================
 UI
 =====================
 */

 return(

  <div className="flex gap-6 p-6 bg-gray-100 min-h-screen">


   {/* LEFT FILTER */}
   <div className="w-1/4">

    <FilterSidebar onApply={fetchWorkers}/>

   </div>


   {/* RIGHT SIDE */}
   <div className="w-3/4">


    {/* SEARCH BAR */}
    <SearchBar onSearch={fetchWorkers}/>


    {/* WORKERS */}
    {loading
     ?
     <p className="mt-6">Loading workers...</p>
     :
     <WorkerList workers={workers}/>
    }

   </div>


  </div>

 );

};

export default FindWorkers;