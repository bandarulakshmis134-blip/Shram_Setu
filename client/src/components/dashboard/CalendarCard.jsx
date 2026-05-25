import { useEffect, useState } from "react";

import axios from "../axiosInstance";

import {
  useNavigate,
} from "react-router-dom";

const CalendarCard = ({
  isWorker,
  showAll = false,
}) => {

  const [events, setEvents] =
    useState([]);

  const navigate =
    useNavigate();

  /*
  =========================
  FETCH CALENDAR DATA
  =========================
  */
  useEffect(() => {

    const fetchCalendarData =
      async () => {

        try {

          const user =
            JSON.parse(
              sessionStorage.getItem(
                "user"
              ) || "null"
            );

          if (!user?.token) {
            setEvents([]);
            return;
          }

          /*
          =========================
          FETCH SCHEDULES
          =========================
          */
          const scheduleRes =
            await axios.get(

              isWorker
                ? `${import.meta.env.VITE_API_URL}/api/schedules/worker`
                : `${import.meta.env.VITE_API_URL}/api/schedules/admin`,

              {
                headers: {
                  Authorization:
                    `Bearer ${user.token}`,
                },
              }
            );

          /*
          =========================
          REMOVE EXPIRED EVENTS
          =========================
          */
          const validSchedules =
            (scheduleRes.data || [])
              .filter((event) => {

                const createdTime =
                  new Date(
                    event.createdAt
                  ).getTime();

                const now =
                  Date.now();

                let duration = 0;

                /*
                URGENCY DURATION
                */
                if (
                  event?.job?.urgency ===
                  "urgent"
                ) {

                  duration =
                    5 *
                    60 *
                    60 *
                    1000;

                }

                else if (
                  event?.job?.urgency ===
                  "24hrs"
                ) {

                  duration =
                    24 *
                    60 *
                    60 *
                    1000;

                }

                else {

                  duration =
                    3 *
                    24 *
                    60 *
                    60 *
                    1000;

                }

                return (
                  now -
                    createdTime <
                  duration
                );

              })

              /*
              NORMALIZE
              */
              .map((event) => ({

                ...event,

                /*
                IMPORTANT
                dedupe using requestId
                */
                uniqueId:
                  event.requestId ||
                  event._id,

                date:
                  event.date ||
                  event.createdAt,

                type:
                  "schedule",

              }));

          /*
          =========================
          FETCH REQUESTS
          =========================
          */
          const requestRes =
            await axios.get(

              isWorker
                ? `${import.meta.env.VITE_API_URL}/api/requests/worker-history`
                : `${import.meta.env.VITE_API_URL}/api/requests/user`,

              {
                headers: {
                  Authorization:
                    `Bearer ${user.token}`,
                },
              }
            );

          /*
          =========================
          FILTER ACTIVE REQUESTS
          =========================
          */
          const requestEvents =
            (requestRes.data || [])

              .filter(

                (request) =>

                  request.status ===
                    "accepted" ||

                  request.status ===
                    "in-progress"

              )

              .map((request) => ({

                _id:
                  request._id,

                uniqueId:
                  request._id,

                title:
                  isWorker

                    ? `Work for ${request.userId?.firstName || "User"}`

                    : `${request.workerId?.firstName || "Worker"}`,

                date:
                  request.createdAt,

                urgency:
                  request.urgency,

                type:
                  "request",

              }));

          /*
          =========================
          MERGE EVENTS
          =========================
          */
          const mergedEvents = [

            ...validSchedules,

            ...requestEvents,

          ];

          /*
          =========================
          REMOVE DUPLICATES
          =========================
          */
          const uniqueEvents = [

            ...new Map(

              mergedEvents.map(
                (event) => [

                  /*
                  dedupe by request
                  */
                  event.uniqueId,

                  event,

                ]
              )

            ).values(),

          ];

          /*
          =========================
          SORT LATEST FIRST
          =========================
          */
          uniqueEvents.sort(

            (a, b) =>

              new Date(
                b.date
              ) -

              new Date(
                a.date
              )

          );

          /*
          =========================
          SAVE
          =========================
          */
          setEvents(
            uniqueEvents
          );

        }

        catch (error) {

          console.log(
            "CALENDAR ERROR:",
            error
          );

          setEvents([]);

        }

      };

    fetchCalendarData();

  }, [isWorker]);

  /*
  =========================
  CARD COLOR
  =========================
  */
  const getColor = (
    urgency
  ) => {

    if (

      urgency === "Urgent" ||

      urgency === "urgent"

    ) {

      return "border-red-500 bg-red-50";

    }

    if (

      urgency === "24 Hours" ||

      urgency === "24hrs"

    ) {

      return "border-orange-500 bg-orange-50";

    }

    return "border-green-500 bg-green-50";

  };

  /*
  =========================
  TIME LABEL
  =========================
  */
  const getTimeLabel = (
    urgency
  ) => {

    if (

      urgency === "Urgent" ||

      urgency === "urgent"

    ) {

      return "5 Hours";

    }

    if (

      urgency === "24 Hours" ||

      urgency === "24hrs"

    ) {

      return "1 Day";

    }

    return "3 Days";

  };

  /*
  =========================
  SHOW LIMIT
  =========================
  */
  const displayedEvents =
    showAll
      ? events
      : events.slice(0, 5);

  return (

    <div className="bg-white p-5 rounded-xl shadow h-fit">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">

        <h2 className="font-semibold">
          Calendar
        </h2>

        {!showAll && (

          <button

            onClick={() =>

              navigate(
                "/all-calendar",
                {
                  state: {
                    isWorker,
                  },
                }
              )

            }

            className="text-sm text-blue-600 hover:text-blue-700"

          >

            View All

          </button>

        )}

      </div>

      {/* EVENTS */}
      <div className="space-y-3">

        {displayedEvents.length === 0 ? (

          <p className="text-sm text-gray-500">

            No scheduled work

          </p>

        ) : (

          displayedEvents.map(
            (event) => (

              <div

                key={
                  event.uniqueId
                }

                className={`border-l-4 rounded-lg p-3 ${getColor(

                  event?.job?.urgency ||

                  event?.urgency

                )}`}

              >

                <div className="flex items-center justify-between">

                  <p className="font-medium text-sm">

                    {event.title}

                  </p>

                  <span className="text-xs font-medium">

                    {getTimeLabel(

                      event?.job?.urgency ||

                      event?.urgency

                    )}

                  </span>

                </div>

                <p className="text-xs text-gray-500 mt-1">

                  {new Date(
                    event.date
                  ).toLocaleString()}

                </p>

              </div>

            )
          )

        )}

      </div>

    </div>

  );

};

export default CalendarCard;