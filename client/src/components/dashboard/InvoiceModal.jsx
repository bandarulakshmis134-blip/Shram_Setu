import InvoiceCard from "./InvoiceCard";

const InvoiceModal = ({
 invoice,
 onClose
}) => {

 if(!invoice) return null;

 return (

  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">

   <div className="bg-white rounded-2xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">

    <button

     onClick={onClose}

     className="absolute top-4 right-4 text-gray-500 text-xl"

    >

     ✕

    </button>

    <InvoiceCard
     invoice={invoice}
    />

   </div>

  </div>

 );

};

export default InvoiceModal;