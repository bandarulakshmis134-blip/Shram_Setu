import { FaBriefcase } from "react-icons/fa";

const ApplyModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl p-15 w-500px text-center shadow-xl">

        {/* Icon */}
        <div className="flex justify-center mb-4 text-blue-500">
          <FaBriefcase size={32} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold">
          Apply for Job
        </h2>

        <p className="text-gray-500 text-sm mt-2">
          Send your profile to the client?
        </p>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">

          <button
            onClick={onClose}
            className="w-full border border-gray-300  px-8 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="w-full bg-blue-600 text-white  px-8 rounded-lg hover:bg-blue-700"
          >
            Send Profile
          </button>

        </div>

      </div>
    </div>
  );
};

export default ApplyModal;