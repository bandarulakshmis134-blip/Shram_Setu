import {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import axios from "../axiosInstance";

import { useNavigate } from "react-router-dom";

import InvoiceModal from "./InvoiceModal";
import RatingModal from "./RatingModal";
import RequestModal from "../findWorkers/RequestModal";

const ActiveRequests = ({
  showAll = false,
}) => {
  const [requests, setRequests] =
    useState([]);

  const [
    selectedInvoice,
    setSelectedInvoice,
  ] = useState(null);

  const [
    showRebookModal,
    setShowRebookModal,
  ] = useState(false);

  const [
    showRating,
    setShowRating,
  ] = useState(false);

  const [
    selectedRequest,
    setSelectedRequest,
  ] = useState(null);

  const navigate = useNavigate();

  /*
  =========================
  GET USER
  =========================
  */
  const getUser = useCallback(() => {
    return JSON.parse(
      sessionStorage.getItem("user") ||
        "null"
    );
  }, []);

  /*
  =========================
  FETCH REQUESTS
  =========================
  */
  const fetchRequests =
    useCallback(async () => {
      try {
        const user = getUser();

        if (!user?.token) return;

        /*
        NORMAL REQUESTS
        */
        const requestRes =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/requests/user`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

        /*
        ADMIN SCHEDULES
        */
        const scheduleRes =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/schedules/admin`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

        const normalRequests =
          requestRes.data || [];

        const schedules =
          scheduleRes.data || [];

        /*
        MERGE SCHEDULES
        */
        const mergedScheduleRequests =
          schedules.map((schedule) => {
            const matchedRequest =
              normalRequests.find(
                (request) =>
                  request._id ===
                  schedule.requestId
              );

            if (matchedRequest) {
              return matchedRequest;
            }

            return {
              _id: schedule._id,

              workerId: {
                firstName: "Worker",
                skills: [],
              },

              service:
                schedule?.job?.title ||
                schedule?.job
                  ?.category ||
                "Service",

              createdAt:
                schedule.createdAt,

              status: "accepted",

              budget:
                schedule?.job?.budget ||
                0,

              /*
              IMPORTANT
              */
              isRated: false,
            };
          });

        /*
        REMOVE DUPLICATES
        */
        const uniqueRequests = [
          ...normalRequests,
          ...mergedScheduleRequests,
        ].filter(
          (
            request,
            index,
            self
          ) =>
            index ===
            self.findIndex(
              (r) =>
                r._id === request._id
            )
        );

        /*
        ENSURE RATING STATUS
        */
        const formattedRequests =
          uniqueRequests.map(
            (request) => ({
              ...request,

              isRated:
                request.isRated ||
                Boolean(
                  request.ratedAt
                ),
            })
          );

        setRequests(
          formattedRequests
        );
      } catch (error) {
        console.error(
          "REQUEST FETCH ERROR:",
          error
        );
      }
    }, [getUser]);

  /*
  =========================
  INITIAL LOAD
  =========================
  */
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  /*
  =========================
  CREATE INVOICE
  =========================
  */
  const handleBill =
    async (request) => {
      try {
        const user = getUser();

        const res =
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/invoices/create`,
            {
              requestId:
                request._id,

              amount:
                request.budget ||
                1000,
            },
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

        setSelectedInvoice(
          res.data
        );
      } catch (error) {
        console.error(
          "INVOICE ERROR:",
          error
        );
      }
    };

  /*
  =========================
  STATUS COLORS
  =========================
  */
  const getStatusStyle = (
    status
  ) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-600";

      case "rejected":
        return "bg-red-100 text-red-600";

      case "accepted":
      case "in-progress":
        return "bg-blue-100 text-blue-600";

      default:
        return "bg-yellow-100 text-yellow-600";
    }
  };

  /*
  =========================
  GET ACTION
  =========================
  */
  const getAction = (
    request
  ) => {
    /*
    COMPLETED + RATED
    */
    if (
      request.status ===
        "completed" &&
      request.isRated
    ) {
      return "Rebook";
    }

    /*
    COMPLETED + NOT RATED
    */
    if (
      request.status ===
      "completed"
    ) {
      return "Rating";
    }

    /*
    ACTIVE
    */
    if (
      request.status ===
        "accepted" ||
      request.status ===
        "in-progress"
    ) {
      return "Bill";
    }

    return "Message";
  };

  /*
  =========================
  ACTION HANDLER
  =========================
  */
  const handleAction = (
    request
  ) => {
    const action =
      getAction(request);

    /*
    MESSAGE
    */
    if (action === "Message") {
      navigate("/messages", {
        state: {
          user: {
            _id:
              request.workerId
                ?._id,

            name:
              request.workerId
                ?.firstName,
          },
        },
      });

      return;
    }

    /*
    BILL
    */
    if (action === "Bill") {
      handleBill(request);
      return;
    }

    /*
    RATING
    */
    if (
      action === "Rating"
    ) {
      setSelectedRequest(
        request
      );

      setShowRating(true);

      return;
    }

    /*
    REBOOK
    */
    if (
      action === "Rebook"
    ) {
      setSelectedRequest(
        request
      );

      setShowRebookModal(
        true
      );
    }
  };

  /*
  =========================
  SUBMIT RATING
  =========================
  */
  const handleRatingSubmit =
    async (rating) => {
      try {
        const user =
          getUser();

        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/requests/${selectedRequest._id}/rate`,
          {
            stars: rating,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        /*
        UPDATE UI
        */
        setRequests((prev) =>
          prev.map((request) =>
            request._id ===
            selectedRequest._id
              ? {
                  ...request,

                  isRated: true,

                  ratedAt:
                    new Date(),
                }
              : request
          )
        );

        alert(
          "Rating submitted successfully"
        );

        setShowRating(false);

        setSelectedRequest(
          null
        );
      } catch (error) {
        console.error(error);

        alert(
          error.response?.data
            ?.message ||
            "Failed to submit rating"
        );
      }
    };

  /*
  =========================
  DISPLAY REQUESTS
  =========================
  */
  const displayedRequests =
    useMemo(() => {
      return showAll
        ? requests
        : requests.slice(0, 2);
    }, [requests, showAll]);

  return (
    <>
      <div className="bg-white p-5 rounded-xl shadow mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">
            Active Requests
          </h2>

          {!showAll && (
            <button
              onClick={() =>
                navigate(
                  "/all-requests"
                )
              }
              className="text-blue-600 text-sm hover:underline"
            >
              View All
            </button>
          )}
        </div>

        {displayedRequests.length ===
        0 ? (
          <p className="text-sm text-gray-500">
            No requests found
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="text-left">
                  Worker
                </th>

                <th className="text-left">
                  Service
                </th>

                <th className="text-left">
                  Date
                </th>

                <th className="text-left">
                  Status
                </th>

                <th className="text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {displayedRequests.map(
                (request) => (
                  <tr
                    key={
                      request._id
                    }
                    className="border-t"
                  >
                    <td className="py-3">
                      {
                        request
                          .workerId
                          ?.firstName
                      }
                    </td>

                    <td>
                      {request.service ||
                        request
                          .workerId
                          ?.skills?.[0] ||
                        "Service"}
                    </td>

                    <td>
                      {new Date(
                        request.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs capitalize ${getStatusStyle(
                          request.status
                        )}`}
                      >
                        {request.status ===
                        "accepted"
                          ? "In Progress"
                          : request.status}
                      </span>
                    </td>

                    <td>
                      <button
                        onClick={() =>
                          handleAction(
                            request
                          )
                        }
                        className="text-blue-600 hover:underline"
                      >
                        {getAction(
                          request
                        )}
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* RATING MODAL */}
      <RatingModal
        isOpen={showRating}
        onClose={() => {
          setShowRating(false);

          setSelectedRequest(
            null
          );
        }}
        onSubmit={
          handleRatingSubmit
        }
      />

      {/* REBOOK MODAL */}
      {showRebookModal &&
        selectedRequest && (
          <RequestModal
            worker={{
              _id:
                selectedRequest
                  .workerId
                  ?._id,

              firstName:
                selectedRequest
                  .workerId
                  ?.firstName,

              skills:
                selectedRequest
                  .workerId
                  ?.skills,
            }}
            onClose={() => {
              setShowRebookModal(
                false
              );

              setSelectedRequest(
                null
              );
            }}
          />
        )}

      {/* INVOICE */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={
            selectedInvoice
          }
          onClose={() =>
            setSelectedInvoice(
              null
            )
          }
        />
      )}
    </>
  );
};

export default ActiveRequests;