const UpcomingWork = () => {

  const jobs = [
    {
      title: "Pipe Installation",
      client: "Meera Singh",
      date: "14 Mar, 2026 at 10:00 AM",
      location: "BTM Layout"
    },
    {
      title: "AC Repair",
      client: "Rohit Sharma",
      date: "15 Mar, 2026 at 2:00 PM",
      location: "HSR Layout"
    }
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow mb-6">

      <h2 className="font-semibold mb-4">
        Upcoming Work
      </h2>

      {jobs.map((job, i) => (
        <div
          key={i}
          className="border rounded p-4 mb-4"
        >

          <p className="font-medium">{job.title}</p>

          <p className="text-sm text-gray-500">
            Client: {job.client}
          </p>

          <p className="text-sm text-gray-500">
            Date: {job.date}
          </p>

          <p className="text-sm text-gray-500">
            Location: {job.location}
          </p>

          <button className="mt-3 w-full bg-green-600 text-white py-2 rounded">
            Send OTP
          </button>

        </div>
      ))}

    </div>
  );
};

export default UpcomingWork;