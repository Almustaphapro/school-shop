

import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const { role } = useSelector((state) => state.auth);

  return (
    <div className="flex">
      <Sidebar role={role} />

      <div className="flex-1 bg-gray-100 min-h-screen p-6">
        {/* React Router will render the child components here */}
        <Outlet /> 
      </div>
    </div>
  );
};

export default DashboardLayout;