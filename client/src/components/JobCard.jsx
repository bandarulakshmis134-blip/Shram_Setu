import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplyModal from "./ApplyModal";
import axios from "../axiosInstance"; // ✅ NEW

import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock
} from "react-icons/fa";

import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { BsFileText } from "react-icons/bs";

const JobCard = ({ job }) => {

  const [open, setOpen] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const navigate = useNavigate();

 const [user] = useState(

 JSON.parse(
  sessionStorage.getItem("user")|| "null"
 )

);

  const jobOwnerId =
    typeof job.postedBy === "object"
      ? job.postedBy?._id
      : job.postedBy;

  const jobOwnerName =
    typeof job.postedBy === "object"
      ? job.postedBy?.firstName
      : "User";

  const handleChat = () => {
    navigate("/messages", {
      state: {
        user: {
          _id: jobOwnerId,
          name: jobOwnerName
        }
      }
    });
  };

  const handleApply = () => {

    if (user?._id === jobOwnerId) {
      alert("You cannot apply to your own job");
      return;
    }

    setOpen(true);
  };

  /*
  =========================
  🔥 UPDATED APPLY LOGIC
  =========================
  */
  const handleConfirm = async () => {

    try {

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/applications/apply`,
        { jobId: job._id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      alert("Application sent successfully!");
      setOpen(false);

    } catch (error) {

      alert(error.response?.data?.message || "Error applying");

    }

  };

  const tagColors = {
    urgent: "bg-red-100 text-red-600",
    "24hrs": "bg-orange-100 text-orange-600",
    flexible: "bg-green-100 text-green-600"
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-5 relative hover:shadow-md transition duration-200">

        <span
          className={`absolute top-3 right-3 px-2 py-1 text-xs rounded-full font-medium 
          ${tagColors[job.type]}`}
        >
          {job.label}
        </span>

        <div className="mb-3 text-blue-500">
          <FaBriefcase size={26} />
        </div>

        <h2 className="text-lg font-semibold mb-2">
          {job.title}
        </h2>

        <p className="text-gray-600 text-sm flex items-center gap-2">
          <FaBriefcase /> {job.category}
        </p>

        <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
          <FaMapMarkerAlt /> {job.location}
        </p>

        <p className="text-sm mt-2">
          <span className="text-gray-500">Budget:</span>{" "}
          <span className="font-medium">{job.budget}</span>
        </p>

        <p className="text-gray-400 text-xs flex items-center gap-2 mt-1">
          <FaClock /> {job.posted}
        </p>

        <div className="flex justify-end gap-2 mt-3">

          <button
            onClick={() => setShowDesc(!showDesc)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <BsFileText size={18} className="text-gray-600" />
          </button>

          <button
            onClick={handleChat}
            className="p-2 rounded-lg hover:bg-green-50"
          >
            <HiOutlineChatBubbleLeftRight size={20} className="text-blue-600" />
          </button>

        </div>

        {showDesc && (
          <div className="mt-3 text-sm text-gray-600 border-t pt-2">
            {job.description || "No description provided"}
          </div>
        )}

        <button
          onClick={handleApply}
          className="mt-4 w-full border border-blue-500 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition text-sm"
        >
          Apply Now
        </button>

      </div>

      <ApplyModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default JobCard;