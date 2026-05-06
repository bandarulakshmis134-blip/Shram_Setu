const StatsCards = ({ type }) => {

  const data =
    type === "admin"
      ? [
          { title: "Total Workers Hired", value: 15 },
          { title: "Active Jobs", value: 3 },
          { title: "Completed", value: 12 }
        ]
      : [
          { title: "New Requests", value: 5 },
          { title: "Completed", value: 28 },
          { title: "Avg Rating", value: 4.9 }
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