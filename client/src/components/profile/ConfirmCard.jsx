const ConfirmCard = ({

 title,
 message,
 confirmText,
 confirmColor,
 onConfirm,
 onCancel

}) => {

 return(

  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">

   <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">

    <h2 className="text-2xl font-bold mb-3 text-gray-800">
     {title}
    </h2>

    <p className="text-gray-600 mb-6 leading-relaxed">
     {message}
    </p>

    <div className="flex justify-end gap-3">

     <button
      onClick={onCancel}
      className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
     >
      Cancel
     </button>

     <button
      onClick={onConfirm}
      className={`${confirmColor} text-white px-5 py-2 rounded-lg`}
     >
      {confirmText}
     </button>

    </div>

   </div>

  </div>

 );

};

export default ConfirmCard;