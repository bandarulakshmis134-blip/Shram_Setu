import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useEffect } from "react";
import socket from "./socket"; // ✅ ADD THIS

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import PostJobs from "./pages/PostJobs";
import WorkerRegister from "./pages/WorkerRegister";
import Dashboard from "./pages/Dashboard";
import FindWorkers from "./pages/FindWorkers";
import Messages from "./pages/Messages";
import AllRequests from "./pages/AllRequests";
/*
========================
LAYOUT WITH NAVBAR
========================
*/
function MainLayout() {

  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  /*
  ========================
  GLOBAL SOCKET JOIN (FIX)
  ========================
  */
  useEffect(() => {

    if (user?._id) {

      socket.emit("join", user._id);

      console.log("GLOBAL JOIN:", user._id); // 🔥 debug

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

        {/* Landing page (NO navbar) */}
        <Route path="/" element={<Landing />} />

        {/* All pages WITH navbar */}
        <Route element={<MainLayout />}>

          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post-jobs" element={<PostJobs />} />
          <Route path="/worker-register" element={<WorkerRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/find-workers" element={<FindWorkers />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:id" element={<Messages />} />
          <Route path="/all-requests" element={<AllRequests />}/>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;