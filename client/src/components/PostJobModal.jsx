import { useState } from "react";
import axios from "../axiosInstance";
import skillsList from "../data/skills";

const PostJobModal = ({ isOpen, onClose, onPost }) => {

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    budget: "",
    urgency: "flexible",
    description: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    if (e) e.preventDefault();

    try {

      /*
      ==========================
      VALIDATION
      ==========================
      */
      if (
        !formData.title ||
        !formData.category ||
        !formData.location ||
        !formData.budget ||
        !formData.description
      ) {
        alert("Please fill all fields");
        return;
      }

      /*
      ==========================
      PREPARE DATA
      ==========================
      */
      const jobData = {
        title: formData.title,
        category: formData.category,
        location: formData.location,
        budget: Number(formData.budget),
        urgency: formData.urgency,
        description: formData.description
      };

      /*
      ==========================
      GET USER + TOKEN (FIXED)
      ==========================
      */
      const stored = sessionStorage.getItem("user");

      if (!stored) {
        alert("Please login again");
        return;
      }

      let user;
      try {
        user = JSON.parse(stored);
      } catch {
        alert("Session error. Please login again");
        return;
      }

      // 🔥 support both formats (important)
      const token = user?.token || user?.accessToken;

      if (!token) {
        alert("Please login again");
        return;
      }

      /*
      ==========================
      SEND REQUEST
      ==========================
      */
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/jobs/create`,
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true // safe for refresh flow
        }
      );

      alert("Job posted successfully");

      /*
      ==========================
      RESET FORM
      ==========================
      */
      setFormData({
        title: "",
        category: "",
        location: "",
        budget: "",
        urgency: "flexible",
        description: ""
      });

      if (onPost) onPost();

      onClose();

    } catch (error) {

      console.log(
        "POST JOB ERROR:",
        error.response?.data || error.message
      );

      // better error feedback
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Session expired. Please login again");
      } else {
        alert("Error submitting the form");
      }

    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4 overflow-y-auto">

      <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="bg-blue-600 text-white text-center py-4 sticky top-0 z-10">
          <p className="text-md">Post Job</p>
        </div>

        {/* FORM */}
        <div className="p-6 space-y-4 overflow-y-auto">

          {/* TITLE */}
          <div>
            <label className="text-sm text-gray-600">
              Job Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 outline-blue-500"
            />
          </div>

          {/* CATEGORY + LOCATION */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-sm text-gray-600">
                Service Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              >
                <option value="">Select...</option>

                {skillsList.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}

              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>

          </div>

          {/* BUDGET */}
          <div>
            <label className="text-sm text-gray-600">
              Budget
            </label>

            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Enter amount"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* URGENCY */}
          <div>
            <label className="text-sm text-gray-600">
              Urgency Level
            </label>

            <div className="flex gap-3 mt-2">

              {["flexible", "24hrs", "urgent"].map((type) => (

                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      urgency: type
                    })
                  }
                  className={`flex-1 border rounded-lg py-2 text-sm
                  ${
                    formData.urgency === type
                      ? type === "urgent"
                        ? "bg-red-100 border-red-500 text-red-600"
                        : type === "24hrs"
                        ? "bg-orange-100 border-orange-500 text-orange-600"
                        : "bg-green-100 border-green-500 text-green-600"
                      : "bg-gray-50"
                  }`}
                >

                  {type === "flexible" && "Flexible"}
                  {type === "24hrs" && "24 Hours"}
                  {type === "urgent" && "Urgent"}

                </button>

              ))}

            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-gray-600">
              Work Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Post Job
          </button>

        </div>

      </div>

    </div>
  );
};

export default PostJobModal;