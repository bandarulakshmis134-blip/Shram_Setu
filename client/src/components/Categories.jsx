import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Categories = () => {

 const [workerCounts,setWorkerCounts] = useState({});
 const navigate = useNavigate();


 const services = [
  { name:"Construction Workers", icon:'🏗️' },
  { name:"Masons / Mestris", icon:'🧱' },
  { name:"Loading & Unloading", icon:'📦' },
  { name:"Digging / Drilling", icon:'⛏️' },
  { name:"Electricians", icon:'⚡' },
  { name:"Plumbers", icon:'🔧' },
  { name:"Carpenters", icon:'🪚' },
  { name:"Appliance Repair", icon:'🔌' },
  { name:"Housekeepers / Cleaners", icon:'🧹' },
  { name:"Painters", icon:'🎨' },
  { name:"Pest Control", icon:'🐜' },
  { name:"Farm Workers", icon:'🌾' },
  { name:"Pet Caretakers", icon:'🐾' },
  { name:"Designated Drivers", icon:'🚗' },
  { name:"Child Care Takers", icon:'👶' },
  { name:"RMP Doctors", icon:'🩺' },
  { name:"Other", icon:'➕' }
 ];


 /*
 =====================
 UI → DB MAPPING
 =====================
 */
 const categoryMap = {
  "Construction Workers":"Construction",
  "Masons / Mestris":"Masons",
  "Loading & Unloading":"Loading",
  "Digging / Drilling":"Digging",
  "Electricians":"Electrician",
  "Plumbers":"Plumber",
  "Carpenters":"Carpenter",
  "Appliance Repair":"Appliance",
  "Housekeepers / Cleaners":"Cleaning",
  "Painters":"Painting",
  "Pest Control":"PestControl",
  "Farm Workers":"FarmWorkers",
  "Pet Caretakers":"PetCare",
  "Designated Drivers":"Drivers",
  "Child Care Takers":"ChildCare",
  "RMP Doctors":"RMPDoctors",
  "Other":"Other"
 };


 /*
 =====================
 FETCH COUNTS (AUTO UPDATE)
 =====================
 */
 useEffect(()=>{

  const fetchCounts = async ()=>{

   try{

    const res = await axios.get(
     "http://localhost:5000/api/workers/count-by-skill"
    );

    setWorkerCounts(res.data || {});

   }
   catch(error){

    console.log("Count fetch error:",error);

   }

  };


  // initial load
  fetchCounts();


  // auto refresh every 5 sec
  const interval = setInterval(fetchCounts,5000);


  // cleanup
  return ()=>clearInterval(interval);

 },[]);


 /*
 =====================
 NAVIGATION
 =====================
 */

 const goToAllWorkers = ()=>{
  navigate("/find-workers");
 };


 const handleCategoryClick = (serviceName)=>{

  const mappedSkill = categoryMap[serviceName] || serviceName;

  const query = new URLSearchParams();
  query.append("category", mappedSkill);

  navigate(`/find-workers?${query.toString()}`);

 };


 return(

  <div className="px-10 mt-12">

   <div className="flex justify-between items-start mb-8">

    <div>
     <h2 className="text-2xl font-bold">Our Services</h2>
     <p className="text-gray-400 mt-1">
      Browse by category to find the right skill
     </p>
    </div>

    <button
     onClick={goToAllWorkers}
     className="text-blue-600 font-medium hover:underline"
    >
     View All →
    </button>

   </div>


   <div className="grid grid-cols-6 gap-6">

    {services.map((service,index)=>(

     <div
      key={index}
      onClick={()=>handleCategoryClick(service.name)}
      className="bg-white rounded-xl p-4 text-center border-2 border-gray-200 shadow-sm cursor-pointer
      transition-all duration-300 transform
      hover:-translate-y-2 hover:scale-105 hover:shadow-lg"
     >

      <div className="text-2xl mb-2 flex justify-center">
       {service.icon}
      </div>

      <h3 className="text-sm font-medium text-gray-800">
       {service.name}
      </h3>

      <p className="text-xs text-blue-500 mt-1">
       {(workerCounts?.[service.name] ?? 0)} Workers
      </p>

     </div>

    ))}

   </div>

  </div>

 );

};

export default Categories;