const Calendar = () => {

 const days = [
  "Su","Mo","Tu","We","Th","Fr","Sa"
 ];


 const dates = [
  1,2,3,4,5,6,7,
  8,9,10,11,12,13,14,
  15,16,17,18,19,20,21,
  22,23,24,25,26,27,28,
  29,30
 ];


 return(

  <div>

   <div className="text-center mb-3">
    April 2026
   </div>


   <div className="grid grid-cols-7 text-xs text-gray-400 mb-2">

    {days.map(d=>(

     <div key={d}>
      {d}
     </div>

    ))}

   </div>


   <div className="grid grid-cols-7 gap-1 text-sm">

    {dates.map(d=>(

     <div

      key={d}

      className={`p-2 text-center rounded

       ${d===17
        ? "bg-black text-white"
        : "hover:bg-gray-200"}

      `}

     >

      {d}

     </div>

    ))}

   </div>

  </div>

 );

};

export default Calendar;