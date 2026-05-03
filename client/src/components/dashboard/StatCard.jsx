const StatCard = ({
 title,
 value,
 icon
}) => {

 return(

  <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">

   <div>

    <p className="text-gray-500 text-sm">
     {title}
    </p>

    <h3 className="text-xl font-bold">
     {value}
    </h3>

   </div>

   <div className="text-2xl">

    {icon}

   </div>

  </div>

 );

};

export default StatCard;