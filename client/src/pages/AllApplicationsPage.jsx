import Applications from "../components/dashboard/Applications";

const AllApplicationsPage = () => {

 return (

  <div className="min-h-screen bg-gray-100 p-6">
    

   <Applications showAll={true}/>

  </div>

 );

};

export default AllApplicationsPage;