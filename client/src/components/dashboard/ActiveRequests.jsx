const ActiveRequests = () => {

  const requests = [
    {
      worker: "Ravi Kumar",
      service: "Construction Workers",
      date: "13 Feb, 2026",
      status: "In Progress"
    },
    {
      worker: "Priya Sharma",
      service: "Housekeepers / Cleaners",
      date: "12 Feb, 2026",
      status: "Completed"
    }
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow mt-6">

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Active Requests</h2>
        <button className="text-blue-600 text-sm">View All</button>
      </div>

      <table className="w-full text-sm">

        <thead className="text-gray-500">
          <tr>
            <th className="text-left">Worker</th>
            <th className="text-left">Service</th>
            <th className="text-left">Date</th>
            <th className="text-left">Status</th>
            <th className="text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((r, i) => (
            <tr key={i} className="border-t">

              <td className="py-3">{r.worker}</td>
              <td>{r.service}</td>
              <td>{r.date}</td>

              <td>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    r.status === "Completed"
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {r.status}
                </span>
              </td>

              <td>
                <button className="text-blue-600">
                  Message
                </button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
};

export default ActiveRequests;