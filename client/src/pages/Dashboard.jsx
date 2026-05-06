import { useState } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCards from "../components/dashboard/StatsCards";
import Applications from "../components/dashboard/Applications";
import ActiveRequests from "../components/dashboard/ActiveRequests";
import CalendarCard from "../components/dashboard/CalendarCard";
import WorkerRequests from "../components/dashboard/WorkerRequests";
import UpcomingWork from "../components/dashboard/UpcomingWork";
import OrderHistory from "../components/dashboard/OrderHistory";
import PostedJobs from "../components/dashboard/PostedJobs";
import MyApplications from "../components/dashboard/MyApplications";

const Dashboard = () => {

  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  const isWorker = user?.skills?.length > 0;

  const [activePanel, setActivePanel] = useState("admin");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <DashboardHeader
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        isWorker={isWorker}
      />

      {/* ADMIN PANEL */}
      {activePanel === "admin" && (
        <>
          <StatsCards type="admin" />

          <div className="grid grid-cols-3 gap-6 mt-6">

            <div className="col-span-2 space-y-6">
              <Applications />
               <PostedJobs /> 
              <ActiveRequests />
            </div>

            <CalendarCard />

          </div>
        </>
      )}

      {/* WORKER PANEL */}
      {isWorker && activePanel === "worker" && (
        <>
          <StatsCards type="worker" />

          <div className="grid grid-cols-3 gap-6 mt-6">

            <div className="col-span-2 space-y-6">
              <WorkerRequests />
              <MyApplications />
              <UpcomingWork />
              <OrderHistory />
            </div>

            <CalendarCard />

          </div>
        </>
      )}

    </div>
  );
};

export default Dashboard;