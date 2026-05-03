import { FaUserCircle, FaStar, FaCamera } from "react-icons/fa";

const ProfileCard = ({
 user,
 isEditing,
 setUser,
 setIsEditing
}) => {

 const handleImageChange = (e) => {

  const file = e.target.files[0];

  if(!file) return;


  if(file.size > 2000000){

   alert("Please choose image smaller than 2MB");

   return;

  }


  const reader = new FileReader();

  reader.onloadend = () => {

   setUser(prev => ({

    ...prev,
    profilePic: reader.result

   }));

  };


  reader.readAsDataURL(file);

 };


 return(

  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">


   <div className="relative mb-4">


    {user.profilePic ? (

     <img
      src={user.profilePic}
      className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow"
     />

    ) : (

     <FaUserCircle size={120}/>

    )}


    {isEditing && (

     <label className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full text-white cursor-pointer">

      <FaCamera size={14}/>

      <input
       type="file"
       accept="image/*"
       onChange={handleImageChange}
       className="hidden"
      />

     </label>

    )}


   </div>


   <h2 className="text-xl font-semibold">

    {`${user.firstName || ""} ${user.lastName || ""}`.trim()}

   </h2>


   {user.skills?.length > 0 && (

    <p className="text-blue-500">
     Skilled Worker
    </p>

   )}


   <div className="flex mt-2 text-yellow-400">

    {[...Array(5)].map((_,i)=>(

     <FaStar key={i}/>

    ))}

   </div>


   <button

    onClick={()=>setIsEditing(true)}

    className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md"

   >

    Edit Profile

   </button>


  </div>

 );

};

export default ProfileCard;