const ApplicationCard = ({
 name,
 job
}) => {

 return(

  <div className="flex justify-between items-center border rounded-lg p-3 mb-3">

   <div>

    <p className="font-medium">
     {name}
    </p>

    <p className="text-sm text-gray-500">
     Applied for {job}
    </p>

   </div>


   <div className="flex gap-2">

    <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">
     Approve
    </button>

    <button className="border px-3 py-1 rounded text-sm">
     Review
    </button>

   </div>

  </div>

 );

};

export default ApplicationCard;