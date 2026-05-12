import MyApplications from "../components/dashboard/MyApplications";

const MyApplicationsPage = () => {

 return (

  <div className="min-h-screen bg-gray-100 p-6">

   <MyApplications showAll={true}/>

  </div>

 );

};

export default MyApplicationsPage;