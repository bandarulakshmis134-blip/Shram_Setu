import WorkerCard from "./WorkerCard";

const WorkerList = ({ workers = [] }) => {

 if (!workers.length) {

  return (
   <p className="mt-10 text-gray-500">
    No workers found
   </p>
  );

 }

 return (

  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-4">

   {workers.map(worker => (

    <WorkerCard
     key={worker._id}
     worker={worker}
    />

   ))}

  </div>

 );

};

export default WorkerList;