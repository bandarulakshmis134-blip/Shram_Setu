import { Trash2 } from "lucide-react";

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

 /*
 REMOVE SKILL
 */
 const removeSkill = (index)=>{

  const updatedSkills =
   (user.skills || []).filter(
    (_,i)=> i !== index
   );

  setUser({

   ...user,

   skills: updatedSkills

  });

 };

 return(

  <div className="bg-white rounded-xl shadow-md p-6">

   <h2 className="text-lg font-semibold mb-4">
    Personal Information
   </h2>

   <div className="grid grid-cols-2 gap-4">

    {[
      "firstName",
      "lastName",
      "email",
      "gender",
      "age",
      "mobile",
      "location"
    ].map(field=>(

      <div key={field}>

        <p className="text-gray-500 text-sm capitalize">
         {field}
        </p>

        {isEditing ? (

          field === "gender" ? (

            <select

              name="gender"

              value={user.gender || "Other"}

              onChange={handleChange}

              className="border p-2 w-full rounded"

            >

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          ) : (

            <input

              name={field}

              value={user[field] || ""}

              onChange={handleChange}

              className="border p-2 w-full rounded"

            />

          )

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

    {/* DESCRIPTION */}
  {user?.skills?.length > 0 && (
  <div className="col-span-2">

    <p className="text-gray-500 text-sm mb-1">
      Description
    </p>

    {isEditing ? (

      <textarea

        name="description"

        value={user.description || ""}

        onChange={handleChange}

        rows={4}

        className="border p-2 w-full rounded"

      />

    ) : (

      <p className="font-medium whitespace-pre-line">

        {user.description || "No description added"}

      </p>

    )}

  </div>
)}
    {/* SKILLS */}
    {Array.isArray(user.skills) &&
    user.skills.length > 0 && (

      <div className="col-span-2">

        <p className="text-gray-500 text-sm mb-2">
         Skills
        </p>

        {isEditing ? (

          <div className="space-y-3">

            {/* EXISTING SKILLS */}
            <div className="flex flex-wrap gap-2">

              {(user.skills || []).map(
                (skill,index)=>(

                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                >

                  <span className="text-sm">
                    {skill}
                  </span>

                  <button
                    type="button"
                    onClick={()=>
                      removeSkill(index)
                    }
                    className="p-1 rounded-full hover:bg-red-50"
                  >

                    <Trash2
                      size={14}
                      className="text-red-500"
                    />

                  </button>

                </div>

              ))}

            </div>

            {/* ADD NEW SKILLS */}
            <SkillsSelector

              defaultSkills={[]}

              setSkills={(newSkills)=>{

                setUser({

                 ...user,

                 skills:[
                  ...(user.skills || []),
                  ...newSkills
                 ]

                });

              }}

            />

          </div>

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