const Applications = () => {

  return (
    <div className="bg-white p-5 rounded-xl shadow mb-6">

      <h2 className="font-semibold mb-4">
        New Job Applications
      </h2>

      {["Suresh Patel", "Vikram Das"].map((name, i) => (
        <div
          key={i}
          className="flex justify-between items-center p-3 border rounded mb-2"
        >
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-gray-500">
              Applied for job
            </p>
          </div>

          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-3 py-1 rounded">
              Approve
            </button>
            <button className="border px-3 py-1 rounded">
              Review
            </button>
          </div>
        </div>
      ))}

    </div>
  );
};

export default Applications;