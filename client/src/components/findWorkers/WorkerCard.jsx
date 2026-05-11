import { useState } from "react";

import {
  MapPin,
  Star,
  Send,
  MessageCircle,
  User
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import RequestModal from "./RequestModal";

import WorkerProfileModal from "../WorkerProfileModal";

const WorkerCard = ({ worker }) => {

  const [showModal, setShowModal] =
    useState(false);

  const [showProfile, setShowProfile] =
    useState(false);

  const navigate = useNavigate();

  return (

    <>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition">

        {/* TOP */}
        <div className="flex gap-4 p-4">

          {worker.profilePic ? (

            <img
              src={worker.profilePic}
              className="w-20 h-20 rounded-lg object-cover"
              alt="worker"
            />

          ) : (

            <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">

              No Image

            </div>

          )}

          <div>

            <h2 className="font-semibold text-gray-800">

              {worker.firstName ||
                worker.groupName}

            </h2>

            <p className="text-blue-600 text-sm font-medium">

              {worker.skills?.[0]}

            </p>

            <div className="flex items-center text-gray-500 text-sm mt-1">

              <MapPin size={14} />

              {worker.location}

            </div>

            <div className="flex items-center mt-1 text-yellow-500">

              <Star size={16} />

              <span className="ml-1 text-sm">

                {worker.rating || 4.5}

              </span>

            </div>

          </div>

        </div>

        {/* SKILLS */}
        <div className="px-4 pb-3 flex gap-2 flex-wrap">

          {worker.skills?.map((skill) => (

            <span
              key={skill}
              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md"
            >

              {skill}

            </span>

          ))}

        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-300 px-4 py-3 flex items-center justify-between">

          <span className="text-xs text-gray-400">

            SS-{worker._id?.slice(-4)}

          </span>

          <div className="flex items-center gap-2">

            {/* CHAT */}
            <button
              onClick={() =>
                navigate("/messages", {
                  state: {
                    user: {
                      _id: worker.userId,
                      name:
                        worker.firstName ||
                        worker.groupName,
                    },
                  },
                })
              }
              className="p-2 bg-green-100 text-blue-600 rounded-lg hover:bg-green-200"
            >

              <MessageCircle size={18} />

            </button>

            {/* PROFILE */}
            <button
              onClick={() =>
                setShowProfile(true)
              }
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
            >

              <User size={18} />

            </button>

            {/* REQUEST */}
            <button
              onClick={() =>
                setShowModal(true)
              }
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
            >

              Send Request

              <Send size={16} />

            </button>

          </div>

        </div>

      </div>

      {/* REQUEST MODAL */}
      {showModal && (

        <RequestModal
          worker={worker}
          onClose={() =>
            setShowModal(false)
          }
        />

      )}

      {/* PROFILE MODAL */}
      {showProfile && (

        <WorkerProfileModal
          worker={worker}
          onClose={() =>
            setShowProfile(false)
          }
        />

      )}

    </>

  );

};

export default WorkerCard;