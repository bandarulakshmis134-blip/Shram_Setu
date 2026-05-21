import {
 BrowserRouter,
 Routes,
 Route,
 Outlet
} from "react-router-dom";

import { useEffect } from "react";

import socket from "./socket";

/*
 PAGES
 */
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import PostJobs from "./pages/PostJobs";
import WorkerRegister from "./pages/WorkerRegister";
import Dashboard from "./pages/Dashboard";
import FindWorkers from "./pages/FindWorkers";
import Messages from "./pages/Messages";
import AllRequests from "./pages/AllRequests";
import WorkerRequestsPage from "./pages/WorkerRequestsPage";
import AIAssistant from "./components/AIAssistant";
import ForgotPassword from "./pages/ForgotPassword";
import AllCalendarPage from "./pages/AllCalendarPage";
/*
 NEW PAGES
 */
import UpcomingWorkPage from "./pages/UpcomingWorkPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import PostedJobsPage from "./pages/PostedJobsPage";
import AllApplicationsPage from "./pages/AllApplicationsPage";

/*
 COMPONENTS
 */
import Navbar from "./components/Navbar";

/*
========================
LAYOUT WITH NAVBAR
========================
*/
function MainLayout() {

 /*
 SAFE USER PARSE
 */
 const user = (() => {
  try {
   const data = localStorage.getItem("user");
   if (!data || data === "undefined") return null;
   return JSON.parse(data);
  } catch {
   return null;
  }
 })();

 /*
 ========================
 GLOBAL SOCKET JOIN
 ========================
 */
 useEffect(() => {

  if (user?._id) {

   socket.emit(
    "join",
    user._id
   );

   console.log(
    "GLOBAL JOIN:",
    user._id
   );

  }

 }, [user?._id]);

 return (

  <>

   <Navbar />

   <Outlet />

  </>

 );

}

/*
========================
APP
========================
*/
function App() {

 return (

  <BrowserRouter>

   <Routes>

    {/* LANDING PAGE */}
    <Route
     path="/"
     element={<Landing />}
    />
     <Route
      path="/login"
      element={<Login />}
     />

     <Route
      path="/signup"
      element={<Signup />}
     />
     
     <Route
      path="/forgot-password"
      element={<ForgotPassword />}
     />

    {/* ALL PAGES WITH NAVBAR */}
    <Route element={<MainLayout />}>

     <Route
      path="/home"
      element={<Home />}
     />


     <Route
      path="/profile"
      element={<Profile />}
     />

     <Route
      path="/post-jobs"
      element={<PostJobs />}
     />

     <Route
      path="/worker-register"
      element={<WorkerRegister />}
     />

     <Route
      path="/dashboard"
      element={<Dashboard />}
     />

     <Route
      path="/find-workers"
      element={<FindWorkers />}
     />

     <Route
      path="/messages"
      element={<Messages />}
     />

     <Route
      path="/messages/:id"
      element={<Messages />}
     />

     <Route
      path="/all-requests"
      element={<AllRequests />}
     />

     {/* NEW VIEW ALL PAGES */}

     <Route
      path="/upcoming-work"
      element={<UpcomingWorkPage />}
     />

     <Route
      path="/my-applications"
      element={<MyApplicationsPage />}
     />

     <Route
      path="/my-posted-jobs"
      element={<PostedJobsPage />}
     />

     <Route
      path="/all-applications"
      element={<AllApplicationsPage />}
     />

     <Route
     path="/worker-requests"
     element={<WorkerRequestsPage />}
     />

     <Route
     path="/all-calendar"
     element={<AllCalendarPage />}
     />


    </Route>

   </Routes>
   <AIAssistant/>

  </BrowserRouter>

 );

}

export default App;