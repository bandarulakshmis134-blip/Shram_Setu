import {
 IndianRupee
} from "lucide-react";

import { Logo } from "../Logo";

const InvoiceCard = ({
 invoice
}) => {

 return (

  <div className="bg-white rounded-xl shadow p-5 border border-gray-200">

   {/* HEADER */}
   <div className="flex items-center justify-between border-b pb-4">

    <div className="flex items-center gap-3">

     <div className="bg-blue-100 p-2 rounded-xl">

      <Logo className="w-10 h-10"/>

     </div>

     <div>

      <h2 className="text-xl font-bold">

       Shram Setu

      </h2>

      <p className="text-sm text-gray-500">

       Invoice

      </p>

     </div>

    </div>

    <div className="text-right">

     <p className="text-sm text-gray-400">
      Invoice ID
     </p>

     <p className="font-semibold">
      #{invoice._id?.slice(-6)}
     </p>

     <p className="text-sm text-gray-500 mt-1">

      {new Date(
       invoice.createdAt
      ).toLocaleDateString()}

     </p>

    </div>

   </div>

   {/* BODY */}
   <div className="grid grid-cols-2 gap-6 mt-6">

    {/* WORKER */}
    <div>

     <p className="text-sm text-gray-400 mb-2">

      Bill From (Worker)

     </p>

     <p className="font-semibold">

      {invoice.workerId?.firstName}

     </p>

     <p className="text-sm text-gray-500">

      {invoice.workerId?.location}

     </p>

    </div>

    {/* USER */}
    <div>

     <p className="text-sm text-gray-400 mb-2">

      Bill To (User)

     </p>

     <p className="font-semibold">

      {invoice.userId?.firstName}

     </p>

     <p className="text-sm text-gray-500">

      {invoice.userId?.location}

     </p>

    </div>

   </div>

   {/* SERVICE TABLE */}
   <div className="mt-6 border rounded-lg overflow-hidden">

    {/* TABLE HEADER */}
    <div className="grid grid-cols-2 bg-gray-100 px-4 py-3 font-medium">

     <p>
      Service
     </p>

     <p className="text-right">
      Amount
     </p>

    </div>

    {/* TABLE BODY */}
    <div className="grid grid-cols-2 px-4 py-4">

     <p className="text-gray-700 font-medium">

      {invoice.service}

     </p>

     <div className="flex justify-end items-center gap-1 font-semibold">

      <IndianRupee size={15}/>

      {invoice.amount}

     </div>

    </div>

   </div>

   {/* TOTAL */}
   <div className="flex justify-between items-center mt-6 border-t pt-4">

    <h2 className="font-bold text-lg">

     Grand Total

    </h2>

    <div className="flex items-center gap-1 text-2xl font-bold text-blue-600">

     <IndianRupee size={22}/>

     {invoice.amount}

    </div>

   </div>

   {/* FOOTER */}
   <div className="mt-5 text-center text-sm text-gray-400 border-t pt-4">

    Thank you for choosing Shram Setu

   </div>

  </div>

 );

};

export default InvoiceCard;