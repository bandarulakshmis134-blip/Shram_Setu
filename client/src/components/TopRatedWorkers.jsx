const TopRatedWorkers = ({
 workers
}) => {

 /*
 =========================
 FILTER UNIQUE SERVICES
 =========================
 */
 const uniqueServiceWorkers = [];

 const usedServices =
  new Set();

 /*
 =========================
 SORT BY:
 1. AVG RATING
 2. TOTAL RATINGS
 =========================
 */
 const sortedWorkers =
  [...(workers || [])]

   .sort((a,b)=>{

    /*
    HIGHER RATING FIRST
    */
    if(

     b.averageRating !==
     a.averageRating

    ){

     return (

      b.averageRating -
      a.averageRating

     );

    }

    /*
    IF SAME RATING
    MORE TOTAL RATINGS FIRST
    */
    return (

     (b.totalRatings || 0) -

     (a.totalRatings || 0)

    );

   });

 /*
 =========================
 PICK UNIQUE SERVICES
 =========================
 */
 sortedWorkers.forEach((worker)=>{

  const primarySkill =

   worker.skills?.[0] ||
   "General Worker";

  /*
  ALREADY USED
  */
  if(
   usedServices.has(
    primarySkill
   )
  ){

   return;

  }

  usedServices.add(
   primarySkill
  );

  uniqueServiceWorkers.push(
   worker
  );

 });

 /*
 =========================
 FINAL TOP 3
 =========================
 */
 const topWorkers =
  uniqueServiceWorkers.slice(0,3);

 return (

  <div className="mt-8 px-6">

   {/* TITLE */}
   <h2 className="text-2xl font-bold mb-4">

    ⭐ Top Rated Workers

   </h2>

   {/* EMPTY */}
   {!topWorkers ||
    topWorkers.length === 0 ? (

    <p className="text-center text-gray-500">

     No workers found

    </p>

   ) : (

    <div className="grid md:grid-cols-3 gap-6">

     {topWorkers.map((worker,index)=>(

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

       {/* REAL RATING */}
       <div className="mt-2 flex items-center gap-2">

        <p className="text-yellow-500 font-semibold">

         ⭐ {Number(
          worker.averageRating || 0
         ).toFixed(1)}

        </p>

        {worker.totalRatings > 0 && (

         <span className="text-xs text-gray-400">

          ({worker.totalRatings})

         </span>

        )}

       </div>

      </div>

     ))}

    </div>

   )}

  </div>

 );

};

export default TopRatedWorkers;