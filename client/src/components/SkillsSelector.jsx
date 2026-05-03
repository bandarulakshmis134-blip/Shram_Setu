import { useState } from "react";
import skillsList from "../data/skills";

const SkillsSelector = ({
 setSkills,
 defaultSkills = []
}) => {

 const [skillInputs,setSkillInputs] = useState(

  defaultSkills.length

   ? defaultSkills.map(skill => ({

      skill: skillsList.includes(skill)
       ? skill
       : "Other",

      other: skillsList.includes(skill)
       ? ""
       : skill

     }))

   : [{ skill:"", other:"" }]

 );


 const updateParent = (inputs)=>{

  /*
  remove duplicates automatically
  */

  const uniqueSkills = [

   ...new Set(

    inputs

     .map(item =>

      item.skill === "Other"

       ? item.other.trim()

       : item.skill

     )

     .filter(Boolean)

   )

  ];

  setSkills(uniqueSkills);

 };


 const handleSkillChange = (index,value)=>{

  const updated = [...skillInputs];

  updated[index].skill = value;

  if(value !== "Other"){

   updated[index].other = "";

  }

  setSkillInputs(updated);

  updateParent(updated);

 };


 const handleOtherChange = (index,value)=>{

  const updated = [...skillInputs];

  updated[index].other = value;

  setSkillInputs(updated);

  updateParent(updated);

 };


 const addSkillInput = ()=>{

  const lastSkill = skillInputs[skillInputs.length-1];

  if(!lastSkill.skill){

   alert("Please select a skill first");

   return;

  }

  setSkillInputs([

   ...skillInputs,

   { skill:"", other:"" }

  ]);

 };


 return(

  <div>

   <label className="text-sm font-medium">

    Skills

   </label>


   {skillInputs.map((item,index)=>(

    <div key={index} className="mt-2">

     <select

      value={item.skill}

      onChange={(e)=>handleSkillChange(index,e.target.value)}

      className="w-full border border-gray-300 rounded-md px-3 py-2"

     >

      <option value="">
       Select Skill
      </option>


      {skillsList.map(skill=>(

       <option
        key={skill}
        value={skill}

        /*
        disable already selected skills
        */

        disabled={

         skillInputs.some(

          (s,i)=> s.skill === skill && i !== index

         )

        }

       >

        {skill}

       </option>

      ))}


      <option value="Other">
       Other
      </option>


     </select>


     {item.skill === "Other" && (

      <input

       type="text"

       placeholder="Enter your skill"

       value={item.other}

       onChange={(e)=>handleOtherChange(index,e.target.value)}

       className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2"

      />

     )}


    </div>

   ))}


   <button

    type="button"

    onClick={addSkillInput}

    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md"

   >

    Add Skill

   </button>


  </div>

 );

};

export default SkillsSelector;