import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";

const DashboardLayout = ({ children }) => {
    const { role } = useSelector((state) => state.auth);

    return ( 
    <div className="flex">
      <Sidebar role={role} />

      <div className="flex-1 bg-gray-100 min-h-screen p-6">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;