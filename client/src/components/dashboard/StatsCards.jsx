import { useEffect, useState } from "react";

import axios from "axios";

const StatsCards = ({ type }) => {

  const [requestCount, setRequestCount] =
    useState(0);

  const [activeJobsCount, setActiveJobsCount] =
    useState(0);

  const [completedCount, setCompletedCount] =
    useState(0);

  const [avgRating,setAvgRating] =
    useState(0);

  /*
  =========================
  FETCH COUNTS
  =========================
  */
  useEffect(() => {

    const fetchData = async () => {

      try {

        const user = JSON.parse(
          sessionStorage.getItem("user")
        );

        /*
        =========================
        WORKER PANEL
        =========================
        */
        if (type === "worker") {

          /*
          NEW REQUESTS
          */
          const requestRes = await axios.get(

            `${import.meta.env.VITE_API_URL}/api/requests/worker`,

            {
              headers: {
                Authorization:
                  `Bearer ${user.token}`
              }
            }

          );

          setRequestCount(
            requestRes.data?.length || 0
          );

          /*
          COMPLETED REQUESTS
          */
          const completedRes =
            await axios.get(

              `${import.meta.env.VITE_API_URL}/api/requests/worker-completed`,

              {
                headers:{
                  Authorization:
                   `Bearer ${user.token}`
                }
              }

            );

          const completedWorks =
            (completedRes.data || []).filter(

              (request)=>

                request.status === "completed"

            ).length;

          setCompletedCount(
            completedWorks
          );

          /*
          AVG RATING
          */
          setAvgRating(

           user.averageRating || 0

          );

        }

        /*
        =========================
        ADMIN PANEL
        =========================
        */
        if(type === "admin"){

          const res = await axios.get(

            `${import.meta.env.VITE_API_URL}/api/requests/user`,

            {
              headers:{
                Authorization:
                 `Bearer ${user.token}`
              }
            }

          );

          /*
          COUNT ACCEPTED / IN PROGRESS
          */
          const activeJobs =
            (res.data || []).filter(

              (request)=>

                request.status === "accepted" ||

                request.status === "in-progress"

            ).length;

          /*
          COUNT COMPLETED
          */
          const completedWorks =
            (res.data || []).filter(

              (request)=>

                request.status === "completed"

            ).length;

          setActiveJobsCount(
            activeJobs
          );

          setCompletedCount(
            completedWorks
          );

        }

      }

      catch (error) {

        console.log(error);

      }

    };

    fetchData();

  }, [type]);

  /*
  =========================
  DATA
  =========================
  */
  const data =
    type === "admin"
      ? [
          {
           title:
               "Total Workers Hired",

           value:
           activeJobsCount + completedCount
          },

          {
            title: "Active Jobs",

            value: activeJobsCount
          },

          {
            title: "Completed",

            value: completedCount
          }
        ]
      : [
          {
            title: "New Requests",

            value: requestCount
          },

          {
            title: "Completed",

            value: completedCount
          },

          {
            title: "Avg Rating",

            value:
             Number(avgRating)
             .toFixed(1)
          }
        ];

  return (

    <div className="grid grid-cols-3 gap-6">

      {data.map((item, i) => (

        <div
          key={i}
          className="bg-white p-5 rounded-xl shadow"
        >

          <p className="text-gray-500 text-sm">

            {item.title}

          </p>

          <h2 className="text-xl font-bold mt-2">

            {item.value}

          </h2>

        </div>

      ))}

    </div>

  );

};

export default StatsCards;