import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import ProfileCard from "../components/ProfileCard";
import PersonalInfo from "../components/PersonalInfo";

const Profile = () => {

 const navigate = useNavigate();

 const storedUser = JSON.parse(
  sessionStorage.getItem("user") || "null"
 );

 const [user,setUser] = useState(storedUser || {});
 const [isEditing,setIsEditing] = useState(false);

 if(!storedUser){

  return(

   <div className="min-h-screen bg-gray-100 flex justify-center items-center">

    <div className="bg-white p-10 rounded-xl shadow-md text-center">

     <h1 className="text-2xl font-bold mb-2">
      Access Your Profile
     </h1>

     <p className="text-gray-500 mb-6">
      Login to view and edit your details
     </p>

     <div className="flex gap-4 justify-center">

      <button
       onClick={()=>navigate("/login")}
       className="bg-blue-600 text-white px-6 py-2 rounded-md"
      >
       Login
      </button>

      <button
       onClick={()=>navigate("/signup")}
       className="bg-gray-600 text-white px-6 py-2 rounded-md"
      >
       Signup
      </button>

     </div>

    </div>

   </div>

  );

 }

 /*
 SAVE PROFILE
 */
 const handleSave = async () => {

  try{

   /*
   REMOVE EMPTY SKILLS
   */
   const cleanedSkills = (
    user.skills || []
   ).filter(

    (skill)=>

     typeof skill === "string" &&
     skill.trim() !== ""

   );

   const updatedData = {

    firstName:user.firstName,

    email:user.email,

    gender:user.gender,

    location:user.location,

    age:user.age !== ""
     ? Number(user.age)
     : undefined,

    mobile:user.mobile
     ? Number(user.mobile)
     : undefined,

    profilePic:user.profilePic || "",

    description:user.description || "",

    /*
    CLEAN SKILLS
    */
    skills:cleanedSkills

   };

   const res = await axios.put(

    `http://localhost:5000/api/users/update/${user._id}`,

    updatedData

   );

   /*
   SAFE WORKER SYNC
   */
   try{

    await axios.put(

     "http://localhost:5000/api/workers/sync-skills",

     {

      userId:user._id,

      skills:cleanedSkills

     }

    );

   }

   catch(err){

    console.error(err);

   }

   /*
   UPDATE SESSION
   */
   sessionStorage.setItem(

    "user",

    JSON.stringify(res.data)

   );

   setUser(res.data);

   setIsEditing(false);

   alert("Profile updated successfully");

  }

  catch(error){

   console.log(
    "SAVE ERROR:",
    error.response?.data || error.message
   );

   alert("Error updating profile");

  }

 };

 return(

  <div className="min-h-screen bg-gray-100 p-6">

   <h1 className="text-2xl font-bold mb-6">
    My Profile
   </h1>

   <div className="grid md:grid-cols-3 gap-6">

    <ProfileCard
     user={user}
     isEditing={isEditing}
     setUser={setUser}
     setIsEditing={setIsEditing}
    />

    <div className="md:col-span-2">

     <PersonalInfo
      user={user}
      isEditing={isEditing}
      setUser={setUser}
     />

     {isEditing && (

      <button
       onClick={handleSave}
       className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
      >
       Save Changes
      </button>

     )}

    </div>

   </div>

  </div>

 );

};

export default Profile;