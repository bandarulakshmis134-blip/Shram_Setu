const WorkerRequests = () => {

  return (
    <div className="bg-white p-5 rounded-xl shadow mb-6">

      <h2 className="font-semibold mb-4">
        Incoming Requests
      </h2>

      <div className="p-4 border rounded">

        <p className="font-medium">Leak Repair</p>
        <p className="text-sm text-gray-500">
          Client: Anita Roy
        </p>

        <div className="flex gap-3 mt-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Accept
          </button>
          <button className="border px-4 py-2 rounded">
            Reject
          </button>
        </div>

      </div>

    </div>
  );
};

export default WorkerRequests;