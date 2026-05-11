import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ActiveRequests = () => {

  const [requests,setRequests] = useState([]);

  const navigate = useNavigate();

  /*
  FETCH REQUESTS
  */
  const fetchRequests = async ()=>{

    try{

      const user = JSON.parse(
        sessionStorage.getItem("user")
      );

      const res = await axios.get(

        "http://localhost:5000/api/requests/user",

        {
          headers:{
            Authorization:
             `Bearer ${user.token}`
          }
        }

      );

      /*
      ONLY LATEST 2
      */
      setRequests(
        (res.data || []).slice(0,2)
      );

    }

    catch(error){

      console.log(error);

    }

  };

  /*
  LOAD REQUESTS
  */
  useEffect(()=>{

    const loadRequests = async ()=>{

      await fetchRequests();

    };

    loadRequests();

  },[]);

  /*
  STATUS COLORS
  */
  const getStatusStyle = (status)=>{

    switch(status){

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
  ACTION BUTTON TEXT
  */
  const getAction = (request)=>{

    switch(request.status){

      case "completed":
        return "Rebook";

      case "accepted":
      case "in-progress":
        return "Bill";

      default:
        return "Message";

    }

  };

  return (

    <div className="bg-white p-5 rounded-xl shadow mt-6">

      <div className="flex justify-between items-center mb-4">

        <h2 className="font-semibold">
          Active Requests
        </h2>

        <button
          onClick={()=>
            navigate("/all-requests")
          }
          className="text-blue-600 text-sm"
        >
          View All
        </button>

      </div>

      {requests.length === 0 ? (

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

            {requests.map((r) => (

              <tr
                key={r._id}
                className="border-t"
              >

                <td className="py-3">

                  {r.workerId?.firstName}

                </td>

                <td>

                  {r.workerId?.skills?.[0] ||
                   "Service"}

                </td>

                <td>

                  {new Date(
                    r.createdAt
                  ).toLocaleDateString()}

                </td>

                <td>

                  <span
                    className={`px-2 py-1 rounded text-xs capitalize ${getStatusStyle(r.status)}`}
                  >

                    {r.status === "accepted"
                     ? "In Progress"
                     : r.status
                    }

                  </span>

                </td>

                <td>

                  <button className="text-blue-600">

                    {getAction(r)}

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
};

export default ActiveRequests;