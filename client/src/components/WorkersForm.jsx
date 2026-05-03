import { useState } from "react";
import SkillsSelector from "./SkillsSelector";

const WorkerForm = ({ onClose }) => {

  const [formData, setFormData] = useState({

    type: "individual",

    firstName: "",

    mobile: "",

    aadhaar: "",

    age: "",

    location: "",

    gender: "",

    experience: "",

    skills: [],

    price: "",

    priceType: "hour"

  });


  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };


  const handleSubmit = (e) => {

    e.preventDefault();

    console.log(formData);

    alert("Worker Registered ✅");

    onClose();

  };


  return (

    <div className="max-w-3xl mx-auto mt-8 bg-white shadow-md rounded-xl p-8">

      <h2 className="text-2xl font-semibold mb-6">
        Worker Registration
      </h2>


      {/* registration type */}

      <div className="mb-4">

        <p className="text-gray-600 mb-2">
          Registration Type
        </p>

        <div className="flex gap-4">

          <button

            type="button"

            onClick={() =>
              setFormData({
                ...formData,
                type: "individual"
              })
            }

            className={`px-6 py-2 rounded-lg border
            ${formData.type==="individual"
              ? "border-blue-600 text-blue-600"
              : "border-gray-300"
            }`}

          >

            Individual Worker

          </button>


          <button

            type="button"

            onClick={() =>
              setFormData({
                ...formData,
                type: "group"
              })
            }

            className={`px-6 py-2 rounded-lg border
            ${formData.type==="group"
              ? "border-blue-600 text-blue-600"
              : "border-gray-300"
            }`}

          >

            Group / Contractor

          </button>

        </div>

      </div>


      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4"
      >

        <input
          name="firstName"
          placeholder="Full Name"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="mobile"
          placeholder="Mobile Number"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="aadhaar"
          placeholder="Aadhaar Number"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="age"
          placeholder="Age"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
        />


        <select
          name="gender"
          onChange={handleChange}
          className="border p-2 rounded"
        >

          <option>
            Gender
          </option>

          <option>
            Male
          </option>

          <option>
            Female
          </option>

        </select>


        <input
          name="experience"
          placeholder="Experience (years)"
          onChange={handleChange}
          className="border p-2 rounded"
        />


        <div className="col-span-2">

          <p className="text-sm mb-1">
            Skills
          </p>

          <SkillsSelector

            setSkills={(skills)=>

              setFormData({

                ...formData,

                skills

              })

            }

          />

        </div>


        <input
          name="price"
          placeholder="Price"
          onChange={handleChange}
          className="border p-2 rounded"
        />


        <select
          name="priceType"
          onChange={handleChange}
          className="border p-2 rounded"
        >

          <option value="hour">
            Per Hour
          </option>

          <option value="day">
            Per Day
          </option>

        </select>


        <button

          type="submit"

          className="col-span-2 bg-blue-600 text-white py-3 rounded-lg mt-4"

        >

          Complete Registration

        </button>

      </form>

    </div>

  );

};

export default WorkerForm;