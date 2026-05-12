import PostedJobs from "../components/dashboard/PostedJobs";

const PostedJobsPage = () => {

 return (

  <div className="min-h-screen bg-gray-100 p-6">

   <PostedJobs showAll={true}/>

  </div>

 );

};

export default PostedJobsPage;