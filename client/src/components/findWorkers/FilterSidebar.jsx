import { useState } from "react";
import skillsList from "../../data/skills";
import { FaFilter } from "react-icons/fa";

const FilterSidebar = ({ onApply }) => {

 const [filters,setFilters] = useState({

  category:"",
  location:"",
  rating:0

 });


 /*
 =====================
 HANDLE INPUT CHANGE
 =====================
 */

 const handleChange = (e)=>{

  setFilters({

   ...filters,
   [e.target.name]: e.target.value

  });

 };


 /*
 =====================
 HANDLE RATING CHANGE
 =====================
 */

 const handleRatingChange = (e)=>{

  setFilters({

   ...filters,
   rating:Number(e.target.value)

  });

 };


 /*
 =====================
 APPLY FILTERS
 =====================
 */

 const applyFilters = ()=>{

  onApply(filters);

 };


 /*
 =====================
 UI
 =====================
 */

 return(

  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">


   {/* HEADER */}

   <div className="flex items-center gap-2 mb-6">

    <FaFilter className="text-gray-600"/>

    <h2 className="font-semibold text-lg">

     Filters

    </h2>

   </div>



   {/* CATEGORY */}

   <div className="mb-5">

    <label className="text-sm text-gray-600">

     Category

    </label>


    <select

     name="category"

     value={filters.category}

     onChange={handleChange}

     className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2"

    >

     <option value="">

      All Categories

     </option>


     {skillsList.map(skill=>(

      <option key={skill} value={skill}>

       {skill}

      </option>

     ))}


    </select>

   </div>



   {/* LOCATION */}

   <div className="mb-5">

    <label className="text-sm text-gray-600">

     Location

    </label>


    <input

     type="text"

     name="location"

     placeholder="Enter City"

     value={filters.location}

     onChange={handleChange}

     className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2"

    />

   </div>



   {/* RATING */}

   <div className="mb-6">

    <p className="text-sm text-gray-600">

     Rating: {filters.rating}+ Stars

    </p>


    <input

     type="range"

     min="0"

     max="5"

     step="1"

     value={filters.rating}

     onChange={handleRatingChange}

     className="w-full mt-3 accent-blue-600 cursor-pointer"

    />


    <div className="flex justify-between text-xs text-gray-400 mt-1">

     <span>0</span>

     <span>5</span>

    </div>

   </div>



   {/* APPLY BUTTON */}

   <button

    onClick={applyFilters}

    className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition"

   >

    Apply Filters

   </button>


  </div>

 );

};

export default FilterSidebar;