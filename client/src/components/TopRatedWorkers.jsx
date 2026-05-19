import WorkerCard
 from "./findWorkers/WorkerCard";

const TopRatedWorkers = ({
 workers
})=>{

 return(

  <div className="mt-8 px-6">

   {/* TITLE */}
   <h2 className="text-2xl font-bold mb-4">

    ⭐ Top Rated Workers

   </h2>

   {/* EMPTY */}
   {!workers ||
    workers.length === 0 ? (

    <p className="text-center text-gray-500">

     No workers found in your area

    </p>

   ) : (

    <div className="grid md:grid-cols-3 gap-6">

     {workers.map((worker)=>(

      <WorkerCard

       key={worker._id}

       worker={worker}

      />

     ))}

    </div>

   )}

  </div>

 );

};

export default TopRatedWorkers;