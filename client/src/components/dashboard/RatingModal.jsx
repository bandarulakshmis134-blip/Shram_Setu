import {
 useState
} from "react";

import {
 Star
} from "lucide-react";

const RatingModal = ({
 isOpen,
 onClose,
 onSubmit
}) => {

 const [rating,setRating] =
  useState(0);

 const [hover,setHover] =
  useState(0);

 if(!isOpen) return null;

 return (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

   <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">

    {/* TOP GLOW */}
    <div className="absolute -top-20 -left-20 w-48 h-48 bg-blue-200 rounded-full blur-3xl opacity-40"/>

    <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-40"/>

    {/* CONTENT */}
    <div className="relative z-10">

     <h2 className="text-3xl font-bold text-center text-gray-800">

      Rate Your Experience

     </h2>

     <p className="text-gray-500 text-center mt-3 leading-relaxed">

      Your feedback helps improve
      the Shram Setu experience.

     </p>

     {/* STARS */}
     <div className="flex justify-center gap-3 mt-10">

      {[1,2,3,4,5].map((star)=>(

       <button

        key={star}

        onClick={()=>
         setRating(star)
        }

        onMouseEnter={()=>
         setHover(star)
        }

        onMouseLeave={()=>
         setHover(0)
        }

        className="transition-transform hover:scale-125"

       >

        <Star

         size={42}

         className={`transition-all duration-200 ${
          star <= (hover || rating)

           ? "fill-yellow-400 text-yellow-400 drop-shadow-md"

           : "text-gray-300"
         }`}

        />

       </button>

      ))}

     </div>

     {/* BUTTONS */}
     <div className="flex justify-center gap-4 mt-12">

      <button

       onClick={onClose}

       className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition"

      >

       Cancel

      </button>

      <button

       onClick={()=>
        onSubmit(rating)
       }

       disabled={!rating}

       className={`px-8 py-2 rounded-full font-medium shadow-lg transition ${
        rating

         ? "bg-yellow-400 hover:bg-yellow-500 text-white"

         : "bg-gray-200 text-gray-400 cursor-not-allowed"
       }`}

      >

       Submit

      </button>

     </div>

    </div>

   </div>

  </div>

 );

};

export default RatingModal;