import SkillsSelector from "../components/SkillsSelector";

const PersonalInfo = ({
 user,
 isEditing,
 setUser
}) => {

 const handleChange = (e)=>{

  setUser({

   ...user,
   [e.target.name]: e.target.value

  });

 };


 return(

  <div className="bg-white rounded-xl shadow-md p-6">

   <h2 className="text-lg font-semibold mb-4">
    Personal Information
   </h2>


   <div className="grid grid-cols-2 gap-4">


    {["firstName","lastName","email","age","mobile","location"].map(field=>(

      <div key={field}>

        <p className="text-gray-500 text-sm capitalize">
         {field}
        </p>


        {isEditing ? (

          <input

            name={field}

            value={user[field] || ""}

            onChange={handleChange}

            className="border p-2 w-full rounded"

          />

        ) : (

          <p className="font-medium">
           {user[field]}
          </p>

        )}

      </div>

    ))}


    <div>

      <p className="text-gray-500 text-sm">
       Aadhaar
      </p>

      <p className="font-medium">
       {user.aadhaar}
      </p>

    </div>


    {/* show skills ONLY for workers */}

    {user.role === "worker" && (

      <div className="col-span-2">

        <p className="text-gray-500 text-sm">
         Skills
        </p>


        {isEditing ? (

          <SkillsSelector

            defaultSkills={user.skills || []}

            setSkills={(skills)=>{

              setUser({

               ...user,
               skills

              });

            }}

          />

        ) : (

          <p className="font-medium">

           {user.skills?.length
            ? user.skills.join(", ")
            : "No skills added"
           }

          </p>

        )}

      </div>

    )}


   </div>


  </div>

 );

};

export default PersonalInfo;