import { useState } from "react";
import axios from "../axiosInstance";
import { useNavigate } from "react-router-dom";

import ConfirmCard from "./ConfirmCard";

const AccountActions = ({

 user,
 setUser

}) => {

 const navigate = useNavigate();

 const [showRetire,setShowRetire] =
  useState(false);

 const [showDisable,setShowDisable] =
  useState(false);

 /*
 =========================
 RETIRE WORKER
 =========================
 */
 const handleRetire = async ()=>{

  try{

   const res = await axios.delete(

    `${import.meta.env.VITE_API_URL}/api/users/retire/${user._id}`

   );

   /*
   UPDATE SESSION
   */
   sessionStorage.setItem(

    "user",

    JSON.stringify(
     res.data.user
    )

   );

   setUser(
    res.data.user
   );

   setShowRetire(false);

   alert(
    "Worker retired successfully"
   );

  }

  catch(error){

   console.log(error);

   alert(
    "Error retiring worker"
   );

  }

 };

 /*
 =========================
 DISABLE ACCOUNT
 =========================
 */
 const handleDisable = async ()=>{

  try{

   await axios.delete(

    `${import.meta.env.VITE_API_URL}/api/users/disable/${user._id}`

   );

   /*
   LOGOUT
   */
   sessionStorage.clear();

   navigate("/");

  }

  catch(error){

   console.log(error);

   alert(
    "Error disabling account"
   );

  }

 };

 return(

  <>

   <div className="bg-white mt-6 rounded-xl shadow-md p-6 border border-gray-200">

    <h2 className="text-xl font-bold mb-4 text-black-600">

     Account Actions

    </h2>

    <div className="flex flex-wrap gap-4">

     {

      user.role === "worker" && (

       <button
        onClick={()=>
         setShowRetire(true)
        }
        className="bg-white-500 hover:bg-white-600 text-black px-5 py-2 rounded-lg"
       >

        Retire Worker

       </button>

      )

     }

     <button
      onClick={()=>
       setShowDisable(true)
      }
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
     >

      Disable Account

     </button>

    </div>

   </div>

   {

    showRetire && (

     <ConfirmCard

      title="Retire Worker?"

      message="Your worker profile will be permanently deleted and you will become a normal user."

      confirmText="Retire"

      confirmColor="bg-blue-500 hover:bg-red-600"

      onConfirm={handleRetire}

      onCancel={()=>
       setShowRetire(false)
      }

     />

    )

   }

   {

    showDisable && (

     <ConfirmCard

      title="Disable Account?"

      message="Your account and worker data will be permanently deleted."

      confirmText="Delete"

      confirmColor="bg-blue-600 hover:bg-red-700"

      onConfirm={handleDisable}

      onCancel={()=>
       setShowDisable(false)
      }

     />

    )

   }

  </>

 );

};

export default AccountActions;