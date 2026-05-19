import {
 Search,
 MapPin
} from "lucide-react";

import {
 useState
} from "react";

import {
 useNavigate
} from "react-router-dom";

const Hero = ()=>{

 const navigate =
  useNavigate();

 const [filters,setFilters] =
  useState({

   category:"",
   location:""

  });

 /*
 =====================
 HANDLE INPUT
 =====================
 */
 const handleChange =
  (e)=>{

   setFilters({

    ...filters,

    [e.target.name]:
     e.target.value

   });

  };

 /*
 =====================
 SEARCH
 =====================
 */
 const handleSearch =
  ()=>{

   const query =
    new URLSearchParams();

   /*
   LOWERCASE SEARCH
   */
   const category =
    filters.category
     .trim()
     .toLowerCase();

   const location =
    filters.location
     .trim()
     .toLowerCase();

   if(category){

    query.append(

     "category",

     category

    );

   }

   if(location){

    query.append(

     "location",

     location

    );

   }

   navigate(

    `/find-workers?${

      query.toString()

    }`

   );

  };

 return(

  <div className="px-10 mt-6">

   <div className="rounded-2xl overflow-hidden relative h-120">

    <img

     src="https://images.unsplash.com/photo-1719859798050-e5bb5df07343"

     className="absolute w-full h-full object-cover"

    />

    <div className="absolute inset-0 bg-blue-900/80">

    </div>

    <div className="relative z-10 text-white px-12 pt-20 max-w-xl">

     <h1 className="text-4xl font-bold">

      Find the Perfect Worker

      <br />

      for Your Needs

     </h1>

     <p className="mt-4 text-gray-200">

      Connect with thousands of skilled professionals in your area.

     </p>

     {/* SEARCH BAR */}
     <div className="bg-white rounded-lg flex items-center mt-8 overflow-hidden">

      {/* CATEGORY */}
      <div className="flex items-center px-4 flex-1 border-r">

       <Search
        className="text-gray-400 w-4 h-4 mr-2"
       />

       <input

        name="category"

        type="text"

        placeholder="What service do you need"

        value={filters.category}

        onChange={handleChange}

        className="outline-none w-full text-gray-700"

       />

      </div>

      {/* LOCATION */}
      <div className="flex items-center px-4 flex-1 border-r">

       <MapPin
        className="text-gray-400 w-4 h-4 mr-2"
       />

       <input

        name="location"

        type="text"

        placeholder="Location"

        value={filters.location}

        onChange={handleChange}

        className="outline-none w-full text-gray-700"

       />

      </div>

      {/* BUTTON */}
      <button

       onClick={handleSearch}

       className="bg-orange-500 text-white px-6 py-3 hover:bg-orange-600"

      >

       Search

      </button>

     </div>

    </div>

   </div>

  </div>

 );

};

export default Hero;