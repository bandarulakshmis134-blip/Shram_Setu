import {
 useState,
 useEffect,
 useRef
} from "react";

import axios from "../axiosInstance";

import {
 useLocation
} from "react-router-dom";

import WorkerList from "../components/findWorkers/WorkerList";

import FilterSidebar from "../components/findWorkers/FilterSidebar";

import SearchBar from "../components/findWorkers/SearchBar";

/* eslint-disable react-hooks/exhaustive-deps */

const FindWorkers = ()=>{

 const [workers,setWorkers] =
  useState([]);

 const [loading,setLoading] =
  useState(false);

 const [page,setPage] =
  useState(1);

 const [hasMore,setHasMore] =
  useState(true);

 /*
 =====================
 ACTIVE FILTERS
 =====================
 */

 const [filters,setFilters] =
  useState({});

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
 OBSERVER REF
 =====================
 */

 const observerRef =
  useRef(null);

 /*
 =====================
 PREVENT MULTIPLE CALLS
 =====================
 */

 const fetchingRef =
  useRef(false);

 /*
 =====================
 GET USER
 =====================
 */

const [user] = useState(

 JSON.parse(
  sessionStorage.getItem("user") || "null"
 )

);

 /*
 =====================
 URL PARAMS
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
  async (

   pageNum = 1,
   currentFilters = {},
   reset = false

  )=>{

   /*
   PREVENT DUPLICATE CALLS
   */

   if(fetchingRef.current){

    return;

   }

   try{

    fetchingRef.current =
     true;

    setLoading(true);

    const res =
     await axios.get(

      `${import.meta.env.VITE_API_URL}/api/workers/search`,

      {
       params:{

        ...currentFilters,

        page:pageNum,

        userId:user?._id,

        registrationType:
         activePanel

       }
      }

     );

    const newWorkers =
     res.data || [];

    /*
    NO MORE DATA
    */

    if(newWorkers.length < 12){

     setHasMore(false);

    }

    /*
    RESET
    */

    if(reset){

     setWorkers(newWorkers);

    }

    /*
    APPEND
    */

    else{

     setWorkers((prev)=>{

      const existingIds =
       new Set(

        prev.map(
         (worker)=>
          worker._id
        )

       );

      const uniqueWorkers =
       newWorkers.filter(

        (worker)=>

         !existingIds.has(
          worker._id
         )

       );

      return [

       ...prev,

       ...uniqueWorkers

      ];

     });

    }

   }

   catch(error){

    console.log(

     "Error fetching workers",

     error

    );

   }

   finally{

    fetchingRef.current =
     false;

    setLoading(false);

   }

  };

 /*
 =====================
 INITIAL LOAD
 =====================
 */

 useEffect(()=>{

  const initializeWorkers =
   async ()=>{

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

    /*
    RESET EVERYTHING
    */

    setWorkers([]);

    setPage(1);

    setHasMore(true);

    setFilters(initialFilters);

    await fetchWorkers(
     1,
     initialFilters,
     true
    );

   };

  initializeWorkers();

 },[
   activePanel,
   locationHook.search
 ]);

 /*
 =====================
 LOAD MORE
 =====================
 */

 useEffect(()=>{

  const loadMoreWorkers =
   async ()=>{

    if(page === 1){

     return;

    }

    await fetchWorkers(
     page,
     filters
    );

   };

  loadMoreWorkers();

 },[
   page
 ]);

 /*
 =====================
 INFINITE SCROLL
 =====================
 */

 useEffect(()=>{

  const observer =
   new IntersectionObserver(

    (entries)=>{

     const first =
      entries[0];

     if(

      first.isIntersecting &&

      !loading &&

      hasMore

     ){

      setPage((prev)=>
       prev + 1
      );

     }

    },

    {
     threshold:0.5
    }

   );

  const currentRef =
   observerRef.current;

  if(currentRef){

   observer.observe(
    currentRef
   );

  }

  return ()=>{

   if(currentRef){

    observer.unobserve(
     currentRef
    );

   }

  };

 },[
    loading,
    hasMore
 ]);

 /*
 =====================
 APPLY FILTERS
 =====================
 */

 const handleApplyFilters =
  (newFilters)=>{

   setWorkers([]);

   setPage(1);

   setHasMore(true);

   setFilters(newFilters);

   fetchWorkers(
    1,
    newFilters,
    true
   );

  };

 /*
 =====================
 UI
 =====================
 */

 return(

  <div
   className="
    flex flex-col lg:flex-row
    gap-6
    p-4 sm:p-6
    bg-gray-100
    min-h-screen
   "
  >

   {/* LEFT FILTER */}

   <div
    className="
     w-full
     lg:w-1/4
    "
   >

    <FilterSidebar
     onApply={
      handleApplyFilters
     }
    />

   </div>

   {/* RIGHT SIDE */}

   <div
    className="
     w-full
     lg:w-3/4
    "
   >

    {/* TOP SWITCH */}

    <div
     className="
      flex flex-col sm:flex-row
      justify-between
      sm:items-center
      gap-3
      mb-4
     "
    >

     <div
      className="
       bg-white
       rounded-lg
       shadow
       p-1
       flex
       w-full sm:w-fit
       overflow-hidden
      "
     >

      {/* INDIVIDUAL */}

      <button

       onClick={() =>
        setActivePanel(
         "individual"
        )
       }

       className={`

        flex-1 sm:flex-none
        px-3 sm:px-4
        py-2 sm:py-1
        text-sm sm:text-base
        rounded
        transition

        ${
         activePanel ===
         "individual"

          ? "bg-blue-600 text-white"

          : "text-gray-700"
        }

       `}

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

       className={`

        flex-1 sm:flex-none
        px-3 sm:px-4
        py-2 sm:py-1
        text-sm sm:text-base
        rounded
        transition

        ${
         activePanel ===
         "group"

          ? "bg-blue-600 text-white"

          : "text-gray-700"
        }

       `}

      >

       Group Workers

      </button>

     </div>

    </div>

    {/* SEARCH */}

    <SearchBar
     onSearch={
      handleApplyFilters
     }
    />

    {/* WORKERS */}

    {loading &&
     workers.length === 0 ? (

     <p
      className="
       mt-6
       text-sm sm:text-base
      "
     >

      Loading workers...

     </p>

    ) : (

     <WorkerList
      workers={workers}
     />

    )}

    {/* LOADING MORE */}

    {loading &&
     workers.length > 0 && (

     <p
      className="
       mt-6
       text-center
       text-gray-500
       text-sm sm:text-base
      "
     >

      Loading more workers...

     </p>

    )}

    {/* OBSERVER */}

    <div
     ref={observerRef}
     className="h-10"
    />

   </div>

  </div>

 );

};

export default FindWorkers;