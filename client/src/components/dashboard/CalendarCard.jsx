import { useEffect, useState } from "react";
import axios from "axios";

const CalendarCard = ({ isWorker }) => {

  const [events, setEvents] = useState([]);

  /*
  =========================
  FETCH SCHEDULES + REQUESTS
  =========================
  */
  useEffect(() => {

    const fetchCalendarData = async () => {

      try {

        const user = JSON.parse(
          sessionStorage.getItem("user")
        );

        /*
        =========================
        EXISTING SCHEDULES
        =========================
        */
        const scheduleRes = await axios.get(

          isWorker
            ? "http://localhost:5000/api/schedules/worker"
            : "http://localhost:5000/api/schedules/admin",

          {
            headers: {
              Authorization:
               `Bearer ${user.token}`
            }
          }

        );

        /*
        AUTO REMOVE EXPIRED WORK
        */
        const validSchedules =
          (scheduleRes.data || []).filter(
            (event) => {

              const createdTime =
                new Date(
                  event.createdAt
                ).getTime();

              const now = Date.now();

              let duration = 0;

              /*
              DURATION BASED ON URGENCY
              */
              if (
                event?.job?.urgency === "urgent"
              ) {

                duration =
                 5 * 60 * 60 * 1000;

              }

              else if (
                event?.job?.urgency === "24hrs"
              ) {

                duration =
                 24 * 60 * 60 * 1000;

              }

              else {

                duration =
                 3 * 24 * 60 * 60 * 1000;

              }

              return (
                now - createdTime <
                duration
              );

            }
          );

        /*
        =========================
        FETCH REQUESTS
        =========================
        */
        const requestRes = await axios.get(

          isWorker
            ? "http://localhost:5000/api/requests/worker-history"
            : "http://localhost:5000/api/requests/user",

          {
            headers:{
              Authorization:
               `Bearer ${user.token}`
            }
          }

        );

        /*
        ONLY ACCEPTED / IN PROGRESS
        */
        const requestEvents =
          (requestRes.data || [])

          .filter(

            (request)=>

              request.status === "accepted" ||

              request.status === "in-progress"

          )

          .map((request)=>({

            _id:request._id,

            title:isWorker

             ? `Work for ${request.userId?.firstName}`

             : `${request.workerId?.firstName}`,

            date:request.createdAt,

            urgency:request.urgency,

            type:"request"

          }));

        /*
        MERGE BOTH
        */
        setEvents([

          ...validSchedules,

          ...requestEvents

        ]);

      }

      catch (error) {

        console.log(error);

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
  const getColor = (urgency) => {

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
  const getTimeLabel = (urgency) => {

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

  return (

    <div className="bg-white p-5 rounded-xl shadow h-fit">

      <h2 className="font-semibold mb-4">
        Calendar
      </h2>

      <div className="space-y-3">

        {events.length === 0 ? (

          <p className="text-sm text-gray-500">
            No scheduled work
          </p>

        ) : (

          events.map((event) => (

            <div
              key={event._id}
              className={`border-l-4 rounded-lg p-3 ${getColor(

                event?.job?.urgency ||

                event?.urgency

              )}`}
            >

              <div className="flex items-center justify-between">

                <p className="font-medium text-sm">

                  {event?.title}

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
                  event?.date
                ).toLocaleString()}

              </p>

            </div>

          ))

        )}

      </div>

    </div>

  );

};

export default CalendarCard;