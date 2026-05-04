const CalendarCard = () => {

  return (
    <div className="bg-white p-5 rounded-xl shadow h-fit">

      <h2 className="font-semibold mb-4">Calendar</h2>

      <input
        type="date"
        className="w-full border p-2 rounded"
      />

      <div className="mt-4 text-sm text-gray-500">
        Google Calendar style integration later
      </div>

    </div>
  );
};

export default CalendarCard;