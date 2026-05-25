import { useEffect,useState } from "react";

import axios from "../utils/axiosInstance";

import WorkerCTA from "../components/WorkerCTA";

import Hero from "../components/Hero";

import Categories from "../components/Categories";

import TopRatedWorkers from "../components/TopRatedWorkers";


const Home = ()=>{


 const [workers,setWorkers] = useState([]);

 const [isWorker,setIsWorker] = useState(false);

 const [loading,setLoading] = useState(true);



 /*
 SAFE USER PARSE
 */

 const getUserFromStorage = ()=>{

  try{

   const data = sessionStorage.getItem("user");

   if(!data || data === "undefined"){

    return null;

   }

   return JSON.parse(data);

  }

  catch{

   return null;

  }

 };


 const user = getUserFromStorage();

 const userId = user?._id;



 /*
 FETCH DATA
 */

 useEffect(()=>{


  const fetchData = async()=>{


   try{


    /*
    get top workers
    */

    const workersRes = await axios.get(

     `${import.meta.env.VITE_API_URL}/api/workers/top-workers`

    );


    setWorkers(

     workersRes.data || []

    );



    /*
    check worker status
    */

    if(userId){


     const checkRes = await axios.get(

      `${import.meta.env.VITE_API_URL}/api/workers/check/${userId}`

     );


     setIsWorker(

      checkRes.data?.isWorker || false

     );

    }


   }

   catch(error){

    console.log(

     "HOME FETCH ERROR",

     error.message

    );

   }

   finally{

    setLoading(false);

   }

  };


  fetchData();


 },[userId]);



 /*
 LOADING UI
 */

 if(loading){

  return(

   <div className="text-center mt-20">

    Loading...

   </div>

  );

 }



 /*
 MAIN UI
 */

 return(

  <div>

   <Hero/>


   <Categories/>


   <TopRatedWorkers workers={workers}/>


   {user && !isWorker && <WorkerCTA/>}


  </div>

 );

};


export default Home;