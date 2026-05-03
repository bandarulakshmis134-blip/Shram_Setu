import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplyModal from "./ApplyModal";
import { FaBriefcase, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const JobCard = ({ job }) => {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Tag color mapping
  const tagColors = {
    urgent: "bg-red-100 text-red-600",
    "24hrs": "bg-orange-100 text-orange-600",
    flexible: "bg-green-100 text-green-600"
  };

  // When user clicks "Send Profile"
  const handleConfirm = () => {
    setOpen(false);

    // You can replace this later with API call
    alert("Application sent successfully!");

    navigate("/post-jobs"); // redirect
  };

  return (
    <>
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 relative hover:shadow-lg transition duration-200">

        {/* Tag */}
        <span
          className={`absolute top-4 right-4 px-3 py-1 text-xs rounded-full font-medium 
          ${tagColors[job.type]}`}
        >
          {job.label}
        </span>

        {/* Icon */}
        <div className="mb-4 text-blue-500">
          <FaBriefcase size={32} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-3">
          {job.title}
        </h2>

        {/* Category */}
        <p className="text-gray-600 text-sm flex items-center gap-2">
          <FaBriefcase /> {job.category}
        </p>

        {/* Location */}
        <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
          <FaMapMarkerAlt /> {job.location}
        </p>

        {/* Budget */}
        <p className="text-sm mt-3">
          <span className="text-gray-500">Budget:</span>{" "}
          <span className="font-medium">{job.budget}</span>
        </p>

        {/* Time */}
        <p className="text-gray-500 text-xs flex items-center gap-2 mt-1">
          <FaClock /> {job.posted}
        </p>

        {/* Apply Button */}
        <button
          onClick={() => setOpen(true)}
          className="mt-5 w-full border border-blue-500 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition"
        >
          Apply Now
        </button>

      </div>

      {/* Modal */}
      <ApplyModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default JobCard;