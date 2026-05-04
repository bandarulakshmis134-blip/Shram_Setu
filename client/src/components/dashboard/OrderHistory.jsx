const OrderHistory = () => {

  const history = [
    { title: "Pipe Fixing", date: "10 Feb", amount: "₹400" },
    { title: "Pipe Fixing", date: "10 Feb", amount: "₹400" },
    { title: "Pipe Fixing", date: "10 Feb", amount: "₹400" }
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <h2 className="font-semibold mb-4">
        Order History
      </h2>

      {history.map((item, i) => (
        <div
          key={i}
          className="flex justify-between items-center border-t py-3"
        >

          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-gray-500">
              {item.date} • {item.amount}
            </p>
          </div>

          <span className="text-green-600 text-sm font-medium">
            Completed
          </span>

        </div>
      ))}

    </div>
  );
};

export default OrderHistory;