import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import SuperDashboard from "./pages/SuperDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SalesShop from "./pages/SalesShop";
import DashboardLayout from "./layouts/DashboardLayout";
import MyTransactions from "./pages/MyTransactions";
import MyPurchase from "./pages/MyPurchase";
// Admin Pages
import StudentList from "./pages/StudentList";
import ClassStudents from "./pages/ClassStudents";
import Addstudent from "./pages/Addstudent";
import StudentInformation from "./pages/StudentInformation";
import StudentProfile from "./pages/StudentProfile";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Super Admin */}
        <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
          <Route path="/super-dashboard" element={<SuperDashboard />} />
        </Route>

        {/* Admin Section */}
        <Route element={<ProtectedRoute allowedRoles={["admin", "superadmin"]} />}>
          <Route path="/admin" element={<DashboardLayout />}>
            {/* Default dashboard page (/admin) */}
            <Route index element={<AdminDashboard />} />

            {/* The Grid of Classes (/admin/student-list) */}
            <Route path="student-list" element={<StudentList />} />

            {/* Specific Class View (/admin/student-list/JSS1A) */}
            <Route path="student-list/:className" element={<ClassStudents />} />
            <Route path="add-student" element={<Addstudent />} />
            <Route path="student-profile/:id" element={<StudentProfile />} />
            <Route path="student-info" element={<StudentInformation />} />
            <Route path="purchase" element={<MyPurchase />} />
          </Route>
        </Route>

      {/* Sales */}
<Route element={<ProtectedRoute allowedRoles={["salesrep"]} />}>
  <Route path="/sales" element={<DashboardLayout />}>

    {/* Default page when visiting /sales */}
    <Route index element={<SalesShop />} />

    {/* Explicit routes */}
    <Route path="shop" element={<SalesShop />} />
    <Route path="report" element={<MyTransactions />} />

  </Route>
</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;