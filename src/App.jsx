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
import SalesReport from "./pages/SalesReport";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTE */}
        <Route path="/" element={<Login />} />

        {/* SUPER ADMIN */}
        <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
          <Route path="/super-dashboard" element={<SuperDashboard />} />
        </Route>

        {/* ADMIN DASHBOARD */}
        <Route element={<ProtectedRoute allowedRoles={["admin", "superadmin"]} />}>
          <Route path="/admin" element={<DashboardLayout />}>

            {/* Default dashboard */}
            <Route index element={<AdminDashboard />} />

            {/* Student Management */}
            <Route path="student-list" element={<StudentList />} />
            <Route path="student-list/:className" element={<ClassStudents />} />
            <Route path="add-student" element={<Addstudent />} />
            <Route path="student-profile/:studentId" element={<StudentProfile />} />
            <Route path="student-info" element={<StudentInformation />} />

            {/* Shop */}
            <Route path="purchase" element={<MyPurchase />} />

            {/* Reports */}
            <Route path="sales-report" element={<SalesReport />} />

          </Route>
        </Route>

        {/* SALES REPRESENTATIVE */}
        <Route element={<ProtectedRoute allowedRoles={["salesrep"]} />}>
          <Route path="/sales" element={<DashboardLayout />}>

            {/* Default */}
            <Route index element={<SalesShop />} />

            {/* Shop */}
            <Route path="shop" element={<SalesShop />} />

            {/* Transactions */}
            <Route path="report" element={<MyTransactions />} />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;