const DashboardHeader = ({ activePanel, setActivePanel, isWorker }) => {

  return (
    <div className="flex justify-between items-center mb-6">

      <h1 className="text-2xl font-bold">
        Dashboard
      </h1>

      {isWorker && (
        <div className="bg-white rounded-lg shadow p-1 flex">

          <button
            onClick={() => setActivePanel("admin")}
            className={`px-4 py-1 rounded ${
              activePanel === "admin"
                ? "bg-blue-600 text-white"
                : ""
            }`}
          >
            Client / Admin Panel
          </button>

          <button
            onClick={() => setActivePanel("worker")}
            className={`px-4 py-1 rounded ${
              activePanel === "worker"
                ? "bg-blue-600 text-white"
                : ""
            }`}
          >
            Worker Panel
          </button>

        </div>
      )}

    </div>
  );
};

export default DashboardHeader;