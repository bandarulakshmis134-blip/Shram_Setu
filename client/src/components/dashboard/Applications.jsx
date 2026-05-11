import { useEffect, useState } from "react";
import axios from "axios";

import WorkerProfileModal from "../WorkerProfileModal";

const Applications = () => {

  const [apps, setApps] = useState([]);

  const [selectedApp, setSelectedApp] =
    useState(null);

  /*
  ========================
  FETCH APPLICATIONS
  ========================
  */
  useEffect(() => {

    const fetchApps = async () => {

      try {

        const user = JSON.parse(
          sessionStorage.getItem("user")
        );

        const res = await axios.get(
          "http://localhost:5000/api/applications/admin",
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );

        setApps(res.data || []);

      }

      catch (error) {

        console.log(error);

        setApps([]);

      }

    };

    fetchApps();

  }, []);

  /*
  ========================
  UPDATE STATUS
  ========================
  */
  const updateStatus = async (
    id,
    status
  ) => {

    try {

      const user = JSON.parse(
        sessionStorage.getItem("user")
      );

      await axios.put(
        `http://localhost:5000/api/applications/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      /*
      UPDATE UI
      */
      setApps((prev) =>
        prev.map((app) =>
          app._id === id
            ? { ...app, status }
            : app
        )
      );

    }

    catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="bg-white p-5 rounded-xl shadow">

      <h2 className="font-semibold mb-4">

        New Job Applications

      </h2>

      {apps.length === 0 ? (

        <p className="text-gray-500 text-sm">

          No applications yet

        </p>

      ) : (

        apps.map((app) => (

          <div
            key={app._id}
            className="border-b py-4"
          >

            <p className="font-medium">

              {app?.worker?.firstName}

            </p>

            <p className="text-sm text-gray-500">

              Applied for:
              {" "}
              {app?.job?.title}

            </p>

            <p className="text-xs mt-1 capitalize text-gray-400">

              Status:
              {" "}
              {app?.status}

            </p>

            {/* ACTIONS */}
            {app?.status === "pending" && (

              <div className="flex gap-2 mt-3">

                {/* REVIEW */}
                <button
                  onClick={() =>
                    setSelectedApp(app)
                  }
                  className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100"
                >

                  Review

                </button>

                {/* ACCEPT */}
                <button
                  onClick={() =>
                    updateStatus(
                      app._id,
                      "accepted"
                    )
                  }
                  className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                >

                  Accept

                </button>

                {/* REJECT */}
                <button
                  onClick={() =>
                    updateStatus(
                      app._id,
                      "rejected"
                    )
                  }
                  className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                >

                  Reject

                </button>

              </div>

            )}

          </div>

        ))

      )}

      {/* WORKER PROFILE MODAL */}
      {selectedApp && (

        <WorkerProfileModal
          worker={selectedApp?.worker}
          onClose={() =>
            setSelectedApp(null)
          }
        />

      )}

    </div>

  );

};

export default Applications;