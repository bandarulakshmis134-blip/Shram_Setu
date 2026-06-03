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
import { getWorkerBadge } from "../../utils/getWorkerBadge";

const WorkerCard = ({ worker }) => {

  const badge = getWorkerBadge(worker);

  const [showModal, setShowModal] =
    useState(false);

  const [showProfile, setShowProfile] =
    useState(false);

  const navigate = useNavigate();

  /*
  =========================
  RATING
  =========================
  */

  const avgRating = Number(
   worker?.averageRating || 0
  );

  return (

    <>

      <div
       className="
        bg-white
        rounded-xl
        shadow-md
        border border-gray-200
        overflow-hidden
        hover:shadow-lg
        transition
       "
      >

        {/* TOP */}

        <div
         className="
          flex flex-col sm:flex-row
          gap-4
          p-4
         "
        >

          {worker.profilePic ? (

            <img
              src={worker.profilePic}
              className="
               w-full
               sm:w-20
               h-52 sm:h-20
               rounded-lg
               object-cover
              "
              alt="worker"
            />

          ) : (

            <div
             className="
              w-full
              sm:w-20
              h-52 sm:h-20
              rounded-lg
              bg-gray-200
              flex items-center justify-center
              text-sm text-gray-500
             "
            >

              No Image

            </div>

          )}

          <div className="flex-1 min-w-0">

          <div
 className="
  flex
  items-center
  gap-2
  flex-wrap
 "
>

 <h2
  className="
   font-semibold
   text-gray-800
   text-base sm:text-lg
   break-words
  "
 >

  {worker.firstName ||
   worker.groupName}

 </h2>

 {badge && (

  <div
   className="
    flex
    items-center
    gap-1
   "
  >

   <img

    src={badge.image}

    alt="SETURYX"

    title="
SETURYX
श्रमेव जयते

The Highest Mark Of Trust & Excellence

Awarded only to workers
with a perfect 5-star rating
and 100+ verified reviews.
"

    className="
     h-10
     w-auto
     object-contain
    "

   />

  </div>

 )}

</div>

{badge && (

 <div
  className="
   flex
   items-center
   gap-2
   mt-1
   flex-wrap
  "
 >

  <span
   className="
    bg-gradient-to-r
    from-yellow-50
    via-yellow-100
    to-yellow-50
    text-yellow-700
    border
    border-yellow-300
    px-2
    py-1
    rounded-full
    text-xs
    font-bold
   "
  >

   💎 SETURYX

  </span>

  <span
   className="
    text-xs
    italic
    text-gray-500
   "
  >

   श्रमेव जयते

  </span>

 </div>

)}

            <p
             className="
              text-blue-600
              text-sm
              font-medium
              break-words
             "
            >

              {worker.skills?.[0]}

            </p>

            <div
             className="
              flex items-center
              gap-1
              text-gray-500
              text-sm
              mt-1
              break-words
             "
            >

              <MapPin size={14} />

              <span className="break-all">

               {worker.location}

              </span>

            </div>

            {/* RATING */}

            <div
             className="
              flex items-center
              mt-1
              text-yellow-500
             "
            >

              <Star
               size={16}
               fill="currentColor"
              />

              <span
               className="
                ml-1
                text-sm
               "
              >

                {avgRating.toFixed(1)}

              </span>

              {worker?.totalRatings > 0 && (

               <span
                className="
                 ml-1
                 text-xs
                 text-gray-400
                "
               >

                ({worker.totalRatings})

               </span>

              )}

            </div>

          </div>

        </div>

        {/* SKILLS */}

        <div
         className="
          px-4
          pb-3
          flex gap-2
          flex-wrap
         "
        >

          {worker.skills?.map((skill) => (

            <span
              key={skill}
              className="
               bg-gray-100
               text-gray-600
               text-xs
               px-2 py-1
               rounded-md
               break-words
              "
            >

              {skill}

            </span>

          ))}

        </div>

        {/* FOOTER */}

        <div
         className="
          border-t border-gray-300
          px-4 py-3
          flex flex-col sm:flex-row
          gap-3
          sm:gap-2
          sm:items-center
          sm:justify-between
         "
        >

          <span
           className="
            text-xs
            text-gray-400
           "
          >

            SS-{worker._id?.slice(-4)}

          </span>

          <div
           className="
            flex flex-wrap
            items-center
            gap-2
           "
          >

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
              className="
               p-2
               bg-green-100
               text-blue-600
               rounded-lg
               hover:bg-green-200
               transition
              "
            >

              <MessageCircle size={18} />

            </button>

            {/* PROFILE */}

            <button
              onClick={() =>
                setShowProfile(true)
              }
              className="
               p-2
               bg-gray-100
               text-gray-600
               rounded-lg
               hover:bg-gray-200
               transition
              "
            >

              <User size={18} />

            </button>

            {/* REQUEST */}

            <button
              onClick={() =>
                setShowModal(true)
              }
              className="
               flex items-center
               justify-center
               gap-2
               bg-blue-600
               text-white
               px-4 sm:px-5
               py-2
               rounded-lg
               hover:bg-blue-700
               transition
               whitespace-nowrap
               text-sm sm:text-base
               flex-1 sm:flex-none
              "
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