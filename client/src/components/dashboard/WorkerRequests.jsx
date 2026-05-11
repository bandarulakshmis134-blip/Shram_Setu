import { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import {
  HiOutlineChatBubbleLeftRight
} from "react-icons/hi2";

import {
  BsFileText
} from "react-icons/bs";

const WorkerRequests = () => {

  const [requests, setRequests] =
    useState([]);

  const [showDesc, setShowDesc] =
    useState(null);

  const navigate = useNavigate();

  /*
  =========================
  FETCH REQUESTS
  =========================
  */
  useEffect(() => {

    const fetchRequests = async () => {

      try {

        const user = JSON.parse(
          sessionStorage.getItem("user")
        );

        const res = await axios.get(
          "http://localhost:5000/api/requests/worker",
          {
            headers: {
              Authorization:
                `Bearer ${user.token}`
            }
          }
        );

        setRequests(res.data || []);

      }

      catch (error) {

        console.log(error);

        setRequests([]);

      }

    };

    fetchRequests();

  }, []);

  /*
  =========================
  UPDATE STATUS
  =========================
  */
const updateStatus = async (
  id,
  type
) => {

  /*
  REMOVE FROM UI
  */
  setRequests((prev) =>
    prev.filter(
      (req) => req._id !== id
    )
  );

  try{

    const user = JSON.parse(
      sessionStorage.getItem("user")
    );

    /*
    ACCEPT REQUEST
    */
    if(type === "accept"){

      await axios.put(

        `http://localhost:5000/api/requests/${id}/status`,

        {
          status:"accepted"
        },

        {
          headers:{
            Authorization:
             `Bearer ${user.token}`
          }
        }

      );

    }

    /*
    REJECT REQUEST
    */
    else if(type === "reject"){

      await axios.put(

        `http://localhost:5000/api/requests/${id}/status`,

        {
          status:"rejected"
        },

        {
          headers:{
            Authorization:
             `Bearer ${user.token}`
          }
        }

      );

    }

  }

  catch(error){

    console.log(error);

  }

};

  /*
  =========================
  CHAT
  =========================
  */
  const openChat = (request) => {

    navigate("/messages", {
      state: {
        user: {
          _id: request.userId?._id,
          name:
            request.userId?.firstName
        }
      }
    });

  };

  /*
  =========================
  URGENCY COLORS
  =========================
  */
  const getUrgencyStyle = (
    urgency
  ) => {

    if (urgency === "Urgent") {

      return "bg-red-100 text-red-600";

    }

    if (urgency === "24 Hours") {

      return "bg-orange-100 text-orange-600";

    }

    return "bg-green-100 text-green-600";
  };

  return (

    <div className="bg-white p-5 rounded-xl shadow mb-6">

      <h2 className="font-semibold mb-4">
        Incoming Requests
      </h2>

      {requests.length === 0 ? (

        <p className="text-sm text-gray-500">
          No incoming requests
        </p>

      ) : (

        requests.map((request) => (

          <div
            key={request._id}
            className="p-4 border rounded-lg mb-4"
          >

            {/* TOP */}
            <div className="flex items-start justify-between">

              <div>

                <p className="font-medium">
                  Service Request
                </p>

                <p className="text-sm text-gray-500">

                  Client:{" "}

                  {request.userId?.firstName}

                </p>

                <p className="text-sm text-gray-400 mt-1">

                  Budget: ₹{request.budget}

                </p>

              </div>

              <span
                className={`text-xs px-2 py-1 rounded-full ${getUrgencyStyle(
                  request.urgency
                )}`}
              >
                {request.urgency}
              </span>

            </div>

            {/* ICONS */}
            <div className="flex justify-end gap-2 mt-3">

              {/* DESCRIPTION */}
              <button
                onClick={() =>
                  setShowDesc(
                    showDesc === request._id
                      ? null
                      : request._id
                  )
                }
                className="p-2 rounded-lg hover:bg-gray-100"
              >

                <BsFileText
                  size={18}
                  className="text-gray-600"
                />

              </button>

              {/* CHAT */}
              <button
                onClick={() =>
                  openChat(request)
                }
                className="p-2 rounded-lg hover:bg-blue-50"
              >

                <HiOutlineChatBubbleLeftRight
                  size={20}
                  className="text-blue-600"
                />

              </button>

            </div>

            {/* DESCRIPTION */}
            {showDesc === request._id && (

              <div className="mt-3 border-t pt-3 text-sm text-gray-600">

                {request.description}

              </div>

            )}

            {/* ACTIONS */}
            <div className="flex gap-3 mt-4">

              <button
               onClick={() =>
                 updateStatus(
                 request._id,
                 "accept"
                )}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Accept
              </button>

              <button
               onClick={() =>
               updateStatus(
               request._id,
               "reject"
              )}
                className="border px-4 py-2 rounded"
              >
                Reject
              </button>

            </div>

          </div>

        ))

      )}

    </div>

  );

};

export default WorkerRequests;