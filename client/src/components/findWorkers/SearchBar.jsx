import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch }) => {

 const [text,setText] = useState("");

 const handleChange = (e)=>{

  const value = e.target.value;

  setText(value);

  // always send object
  onSearch({ search:value });

 };

 return(

  <div className="mb-6">

   <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-5 py-3 shadow-sm">

    <FaSearch className="text-gray-400 mr-3"/>

    <input
     type="text"
     placeholder="Search for workers, skills, or ID..."
     value={text}
     onChange={handleChange}
     className="bg-transparent w-full outline-none text-gray-700"
    />

   </div>

  </div>

 );

};

export default SearchBar;