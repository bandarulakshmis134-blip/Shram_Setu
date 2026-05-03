const RequestRow = ({
 worker,
 service,
 date,
 status
}) => {

 return(

  <tr className="border-t">

   <td className="py-2">
    {worker}
   </td>

   <td>
    {service}
   </td>

   <td>
    {date}
   </td>

   <td>

    {status === "progress" && (

     <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
      In Progress
     </span>

    )}


    {status === "completed" && (

     <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
      Completed
     </span>

    )}

   </td>

   <td className="text-blue-600 cursor-pointer">
    Message
   </td>

  </tr>

 );

};

export default RequestRow;