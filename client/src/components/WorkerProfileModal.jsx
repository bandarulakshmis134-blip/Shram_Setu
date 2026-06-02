import {
 X,
 Star,
 MapPin,
 Briefcase
} from "lucide-react";

import { Logo } from "./Logo";

const WorkerProfileModal = ({
 worker,
 onClose
}) => {

 if(!worker) return null;

 /*
 =========================
 RATING
 =========================
 */
 const avgRating = Number(
  worker?.averageRating || 0
 );

 return (

  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">

   <div className="bg-white w-full max-w-lg rounded-xl shadow-lg border border-gray-200 relative max-h-[88vh] overflow-y-auto">

    {/* CLOSE */}
    <button
     onClick={onClose}
     className="absolute top-4 right-4 text-white hover:text-gray-200 z-10"
    >

     <X size={20}/>

    </button>

    {/* TOP BLUE HEADER */}
    <div className="bg-blue-600 px-5 py-3 flex items-center">

     <div className="flex items-center gap-2">

      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">

       <Logo className="w-6 h-6"/>

      </div>

      <h2 className="text-white font-semibold text-lg">

       Shram Setu

      </h2>

     </div>

    </div>

    {/* PROFILE HEADER */}
    <div className="p-6 border-b border-gray-200">

     <div className="flex items-start gap-4">

      {/* IMAGE */}
      {worker.profilePic ? (

       <img
        src={worker.profilePic}
        alt="worker"
        className="w-20 h-20 rounded-xl object-cover border border-gray-200"
       />

      ) : (

       <div className="w-20 h-20 rounded-xl bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">

        {worker.firstName?.charAt(0) || "W"}

       </div>

      )}

      {/* INFO */}
      <div className="flex-1">

       <h2 className="text-xl font-semibold text-gray-800">

        {worker.firstName ||
         worker.groupName ||
         "Worker"}

       </h2>

       <p className="text-blue-600 text-sm font-medium mt-1">

        {worker.skills?.[0] ||
         "General Worker"}

       </p>

       <div className="flex items-center text-gray-500 text-sm mt-2">

        <MapPin size={14}/>

        <span className="ml-1">

         {worker.location || "Location not available"}

        </span>

       </div>

       {/* RATING */}
       <div className="flex items-center mt-2 gap-1">

        {[...Array(5)].map((_,i)=>(

         <Star

          key={i}

          size={16}

          fill={
           i < Math.round(avgRating)

            ? "currentColor"

            : "none"
          }

          className={
           i < Math.round(avgRating)

            ? "text-yellow-500"

            : "text-gray-300"
          }

         />

        ))}

        <span className="ml-1 text-sm font-medium text-gray-700">

         {avgRating.toFixed(1)}

        </span>

        {worker?.totalRatings > 0 && (

         <span className="text-xs text-gray-500">

          ({worker.totalRatings})

         </span>

        )}

       </div>

      </div>

     </div>

    </div>

    {/* CONTENT */}
    <div className="p-6 space-y-5">

     {/* INFORMATION */}
     <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">

      <h3 className="font-semibold text-gray-800 mb-4">

       Information

      </h3>

      <div className="grid grid-cols-2 gap-4">

       <div>

        <p className="text-sm text-gray-500">
         Age
        </p>

        <p className="font-medium text-gray-800">

         {worker.age || "-"}

        </p>

       </div>

       <div>

        <p className="text-sm text-gray-500">
         Gender
        </p>

        <p className="font-medium text-gray-800">

         {worker.gender || "-"}

        </p>

       </div>


      </div>

     </div>

     {/* DESCRIPTION */}
     <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">

      <h3 className="font-semibold text-gray-800 mb-3">

       Description

      </h3>

      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">

       {worker.description ||
        "No description added yet."}

      </p>

     </div>

     {/* SKILLS */}
     <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">

      <h3 className="font-semibold text-gray-800 mb-4">

       Skills

      </h3>

      <div className="flex flex-wrap gap-2">

       {worker.skills?.length > 0 ? (

        worker.skills.map((skill,index)=>(

         <span
          key={index}
          className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-lg"
         >

          {skill}

         </span>

        ))

       ) : (

        <p className="text-sm text-gray-500">

         No skills added

        </p>

       )}

      </div>

     </div>

    </div>

   </div>

  </div>

 );

};

export default WorkerProfileModal;