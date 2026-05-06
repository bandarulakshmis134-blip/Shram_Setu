import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";

const MyApplications = () => {

  const [apps, setApps] = useState([]);

  /*
  =========================
  FETCH APPLICATIONS
  =========================
  */
  useEffect(() => {

    const fetchApps = async () => {

      try {

        const user = JSON.parse(
          sessionStorage.getItem("user")
        );

        const res = await axios.get(
          "http://localhost:5000/api/applications/worker",
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );

        setApps(res.data || []);

      }

      catch (error) {

        console.log(
          "APPLICATION ERROR:",
          error
        );

        setApps([]);

      }

    };

    fetchApps();

  }, []);

  /*
  =========================
  DELETE APPLICATION
  =========================
  */
  const handleDelete = async (id) => {

    try {

      const user = JSON.parse(
        sessionStorage.getItem("user")
      );

      await axios.delete(
        `http://localhost:5000/api/applications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      /*
      REMOVE FROM UI
      */
      setApps((prevApps) =>
        prevApps.filter(
          (app) => app._id !== id
        )
      );

    }

    catch (error) {

      console.log(
        "DELETE ERROR:",
        error
      );

      alert(
        "Failed to delete application"
      );

    }

  };

  return (

    <div className="bg-white p-5 rounded-xl shadow">

      <h2 className="font-semibold mb-4">
        Jobs You Applied
      </h2>

      {apps.length === 0 ? (

        <p className="text-gray-500 text-sm">
          No applications yet
        </p>

      ) : (

        apps.map((app) => (

          <div
            key={app._id}
            className="border-b py-3 flex items-center justify-between"
          >

            <div>

              <p className="font-medium">
                {app?.job?.title ||
                  "Job unavailable"}
              </p>

              <p className="text-sm text-gray-500">
                Status:{" "}
                {app?.status || "pending"}
              </p>

            </div>

            {/* DELETE ICON */}
            {app?.status !== "accepted" && (

              <button
                onClick={() =>
                  handleDelete(app._id)
                }
                className="p-2 rounded-lg hover:bg-red-50"
              >

                <Trash2
                  size={18}
                  className="text-red-500"
                />

              </button>

            )}

          </div>

        ))

      )}

    </div>

  );

};

export default MyApplications;