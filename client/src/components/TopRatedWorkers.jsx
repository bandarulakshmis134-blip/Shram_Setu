const TopRatedWorkers = ({ workers }) => {
  return (
    <div className="mt-8 px-6">

      {/* ✅ Always visible */}
      <h2 className="text-2xl font-bold mb-4">
        ⭐ Top Rated Workers
      </h2>

      {/* 🔥 Conditional rendering */}
      {!workers || workers.length === 0 ? (
        <p className="text-center text-gray-500">
          No workers found
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">

          {workers.map((worker, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold">
                {worker.firstName}
              </h3>

              <p className="text-gray-500 text-sm">
                📍 {worker.location}
              </p>

              <p className="text-gray-600 mt-2">
                Skills: {worker.skills?.join(", ")}
              </p>

              <p className="mt-2 text-yellow-500 font-semibold">
                ⭐ {worker.rating || "4.5"}
              </p>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default TopRatedWorkers;