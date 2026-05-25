import { useState, useEffect } from "react";
import SkillsSelector from "../components/SkillsSelector";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WorkerRegister = () => {

 const navigate = useNavigate();

 const [checkingWorker,setCheckingWorker] = useState(true);

 const [alreadyWorker,setAlreadyWorker] = useState(false);

 const [type,setType] = useState("individual");


 const [formData,setFormData] = useState({

  firstName:"",
  groupName:"",

  price:"",
  priceType:"Per Hour",

  skills:[],

  description:"",

  age:"",
  gender:"",
  aadhaar:"",

  members:[
   {
    name:"",
    age:"",
    gender:"",
    aadhaar:"",
    skill:""
   }
  ]

 });


 /*
 CHECK LOGIN + WORKER STATUS
 */

 useEffect(()=>{

  const user = JSON.parse(

   sessionStorage.getItem("user")

  );

  if(!user){

   navigate("/login");

   return;

  }


  const checkWorkerStatus = async()=>{

   try{

    const res = await axios.get(

     `${import.meta.env.VITE_API_URL}/api/workers/check/${user._id}`

    );

    if(res.data.isWorker){

     setAlreadyWorker(true);

    }

   }

   catch(error){

    console.log(error);

   }

   finally{

    setCheckingWorker(false);

   }

  };

  checkWorkerStatus();

 },[navigate]);


 /*
 INPUT CHANGE
 */

 const handleChange = (e)=>{

  setFormData(prev=>({

   ...prev,
   [e.target.name]:e.target.value

  }));

 };


 /*
 SKILLS
 */

 const setSkills = (skills)=>{

  setFormData(prev=>({

   ...prev,
   skills

  }));

 };


 /*
 ADD GROUP MEMBER
 */

 const addMember = ()=>{

  setFormData(prev=>({

   ...prev,

   members:[

    ...prev.members,

    {
     name:"",
     age:"",
     gender:"",
     aadhaar:"",
     skill:""
    }

   ]

  }));

 };


 /*
 UPDATE GROUP MEMBER
 */

 const handleMemberChange = (index,field,value)=>{

  const updatedMembers = [...formData.members];

  updatedMembers[index][field] = value;

  setFormData(prev=>({

   ...prev,
   members:updatedMembers

  }));

 };


 /*
 SUBMIT FORM
 */

 const handleSubmit = async(e)=>{

  e.preventDefault();

  if(formData.skills.length===0){

   alert("Please select at least one skill");

   return;

  }

  const user = JSON.parse(

   sessionStorage.getItem("user")

  );


  const workerData = {

   userId:user._id,

   registrationType:type,

   firstName:type==="individual"
    ? formData.firstName
    : undefined,

   groupName:type==="group"
    ? formData.groupName
    : undefined,

   mobile:Number(formData.mobile),

   location:formData.location,

   experience:Number(formData.experience),

   skills:formData.skills,

   description:formData.description,

   price:Number(formData.price),

   priceType:formData.priceType,

   age:type==="individual" && formData.age
    ? Number(formData.age)
    : undefined,

   gender:type==="individual"
    ? formData.gender
    : undefined,

   aadhaar:type==="individual" && formData.aadhaar
    ? Number(formData.aadhaar)
    : undefined,

   members:type==="group"
    ? formData.members.map(member=>({

      name:member.name,

      age:member.age
       ? Number(member.age)
       : undefined,

      gender:member.gender,

      aadhaar:member.aadhaar
       ? Number(member.aadhaar)
       : undefined,

      skill:member.skill

     }))
    : []

  };


  try{

   await axios.post(

    `${import.meta.env.VITE_API_URL}/api/workers/register`,

    workerData

   );

   alert("Worker registered successfully");


   const updatedUser = {

    ...user,

    role:"worker",

    skills:workerData.skills,

    mobile:workerData.mobile,

    location:workerData.location,

    description:formData.description

   };

   sessionStorage.setItem(

    "user",

    JSON.stringify(updatedUser)

   );


   navigate("/profile");

  }

  catch(error){

   alert(

    error.response?.data?.message ||

    "Error saving worker"

   );

  }

 };


 /*
 UI STATES
 */

 if(checkingWorker){

  return(

   <div className="text-center mt-20">

    Checking worker status...

   </div>

  );

 }


 if(alreadyWorker){

  return(

   <div className="text-center mt-20">

    <h2 className="text-2xl font-bold text-green-600">

     You are already registered as a worker 

    </h2>

   </div>

  );

 }


 /*
 FORM UI
 */

 return(

  <div className="min-h-screen bg-gray-100 py-10">

   <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">

    <h1 className="text-2xl font-bold mb-6">

     Worker Registration

    </h1>


    {/* TYPE */}

    <div className="mb-6">

     <p className="text-gray-600 mb-2">

      Registration Type

     </p>


     <div className="flex gap-4">

      <button
       type="button"
       onClick={()=>setType("individual")}
       className={`px-5 py-2 rounded-lg border

       ${type==="individual"

        ?"border-blue-600 text-blue-600"

        :"border-gray-300"}

       `}
      >

       Individual Worker

      </button>


      <button
       type="button"
       onClick={()=>setType("group")}
       className={`px-5 py-2 rounded-lg border

       ${type==="group"

        ?"border-blue-600 text-blue-600"

        :"border-gray-300"}

       `}
      >

       Group / Contractor

      </button>

     </div>

    </div>


    <form
     onSubmit={handleSubmit}
     className="grid grid-cols-2 gap-4"
    >


     {/* INDIVIDUAL */}

     {type==="individual" && (

      <>

      <input
  type="text"
  name="firstName"
  placeholder="Full Name"
  onChange={(e) => {
    const value = e.target.value;

    // Allow only alphabets, spaces, dots, hyphens, apostrophes
    if (/^[A-Za-z\s.'-]*$/.test(value)) {
      handleChange(e);
    }
  }}
  required
  className="border p-2 rounded"
/>

       <input name="mobile" placeholder="Mobile Number" onChange={handleChange} required className="border p-2 rounded"/>

      <input
  type="text"
  name="aadhaar"
  placeholder="Aadhaar Number"
  maxLength={12}
  pattern="\d{12}"
  title="Aadhaar number must be exactly 12 digits"
  onChange={(e) => {
    const value = e.target.value;

    // Allow only numbers and restrict to 12 digits
    if (/^\d{0,12}$/.test(value)) {
      handleChange(e);
    }
  }}
  required
  className="border p-2 rounded"
/>

     <input
  type="number"
  name="age"
  placeholder="Age"
  min="18"
  max="60"
  onChange={(e) => {
    const value = e.target.value;

    // Allow empty input
    if (value === "") {
      handleChange(e);
      return;
    }

    const num = Number(value);

    // Restrict age between 18 and 60
    if (num >= 18 && num <= 60) {
      handleChange(e);
    }
  }}
  required
  className="border p-2 rounded"
/>

       <input name="location" placeholder="Location" onChange={handleChange} required className="border p-2 rounded col-span-2"/>

       <select name="gender" onChange={handleChange} required className="border p-2 rounded">

        <option value="">Gender</option>
        <option>Male</option>
        <option>Female</option>

       </select>

       <input name="experience" placeholder="Experience (years)" onChange={handleChange} required className="border p-2 rounded"/>


       <div className="col-span-2">

        <p>Skills</p>

        <SkillsSelector setSkills={setSkills}/>

       </div>

       <div className="col-span-2">

        <p className="mb-1">
         Description
        </p>

        <textarea

         name="description"

         value={formData.description}

         onChange={handleChange}

         rows={4}

         placeholder="Tell clients about your work experience..."

         className="border p-3 rounded w-full"

        />

       </div>


       <input name="price" placeholder="Price" onChange={handleChange} required className="border p-2 rounded"/>


       <select name="priceType" onChange={handleChange} className="border p-2 rounded">

        <option>Per Hour</option>
        <option>Per Day</option>

       </select>

      </>

     )}


     {/* GROUP */}

     {type==="group" && (

      <>

      <input
  type="text"
  name="groupName"
  placeholder="Group Name"
  onChange={(e) => {
    const value = e.target.value;

    // Allow only alphabets, spaces, dots, hyphens, apostrophes
    if (/^[A-Za-z\s.'-]*$/.test(value)) {
      handleChange(e);
    }
  }}
  required
  className="border p-2 rounded"
/>

       <input name="mobile" placeholder="Mobile Number" onChange={handleChange} required className="border p-2 rounded"/>

       <input name="location" placeholder="Location" onChange={handleChange} required className="border p-2 rounded col-span-2"/>

       <input name="experience" placeholder="Experience (years)" onChange={handleChange} required className="border p-2 rounded"/>


       <div className="col-span-2">

        <p>Skills</p>

        <SkillsSelector setSkills={setSkills}/>

       </div>

       <div className="col-span-2">

        <p className="mb-1">
         Description
        </p>

        <textarea

         name="description"

         value={formData.description}

         onChange={handleChange}

         rows={4}

         placeholder="Tell clients about your team and work experience..."

         className="border p-3 rounded w-full"

        />

       </div>


       <div className="col-span-2 mt-4">

        <div className="flex justify-between">

         <h3 className="font-semibold">

          Group Members

         </h3>


         <button
          type="button"
          onClick={addMember}
          className="text-blue-600"
         >

          + Add Member

         </button>

        </div>


        {formData.members.map((member,index)=>(

         <div key={index} className="grid grid-cols-5 gap-2 mt-2">

          <input placeholder="Name" onChange={(e)=>handleMemberChange(index,"name",e.target.value)} className="border p-2 rounded"/>

          <input
  type="number"
  placeholder="Age"
  min="18"
  max="60"
  onChange={(e) => {
    const value = e.target.value;

    // Allow empty input
    if (value === "") {
      handleMemberChange(index, "age", value);
      return;
    }

    const num = Number(value);

    // Restrict between 18 and 60
    if (num >= 18 && num <= 60) {
      handleMemberChange(index, "age", value);
    }
  }}
  className="border p-2 rounded"
/>

          <select onChange={(e)=>handleMemberChange(index,"gender",e.target.value)} className="border p-2 rounded">

           <option>Gender</option>
           <option>Male</option>
           <option>Female</option>

          </select>

   <input
  type="text"
  placeholder="Aadhaar"
  maxLength={12}
  pattern="\d{12}"
  title="Aadhaar number must be exactly 12 digits"
  onChange={(e) => {
    const value = e.target.value;

    // Allow only numbers and restrict to 12 digits
    if (/^\d{0,12}$/.test(value)) {
      handleMemberChange(index, "aadhaar", value);
    }
  }}
  className="border p-2 rounded"
/>
          <input placeholder="Skill" onChange={(e)=>handleMemberChange(index,"skill",e.target.value)} className="border p-2 rounded"/>

         </div>

        ))}

       </div>


       <input name="price" placeholder="Price" onChange={handleChange} required className="border p-2 rounded"/>


       <select name="priceType" onChange={handleChange} className="border p-2 rounded">

        <option>Per Hour</option>
        <option>Per Day</option>

       </select>

      </>

     )}


     <button
      type="submit"
      className="col-span-2 mt-6 bg-[#1f2d3d] text-white py-3 rounded-lg"
     >

      Complete Registration

     </button>


    </form>

   </div>

  </div>

 );

};

export default WorkerRegister;