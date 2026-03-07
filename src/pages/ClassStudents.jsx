import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleStudentStatus, depositMoney } from "../features/students/studentSlice";
import { FiArrowLeft, FiInfo, FiToggleLeft } from "react-icons/fi";
import DepositModal from "../components/DepositModal";

const ClassStudents = () => {
  const { className } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get all students from Redux store
  const allStudents = useSelector((state) => state.students.students);
  
  // Filter students by class
  const [students, setStudents] = useState([]);
  const [showLimitInfo, setShowLimitInfo] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  
  const WEEKLY_LIMIT = 1500; // ₦1,500 weekly limit (for reference only)

  useEffect(() => {
    // Filter students that belong to this class
    const classStudents = allStudents.filter(
      student => student.className === className
    );
    setStudents(classStudents);
  }, [className, allStudents]);

  const handleToggleStatus = (student) => {
    const action = student.status ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} ${student.name}?`)) {
      dispatch(toggleStudentStatus(student.id));
    }
  };

  const handleDepositMoney = (student) => {
    setSelectedStudent(student);
    setShowDepositModal(true);
  };

 // In ClassStudents.jsx, update the confirmDeposit function:
const confirmDeposit = (id, amount, description) => {
  dispatch(depositMoney({ id, amount }));
  
  // Show success message with transaction details
  alert(`✅ ₦${amount.toLocaleString()} deposited successfully!
  
Transaction has been recorded in the student's history.`);
};
  // In ClassStudents.jsx, update the viewProfile function:
const viewProfile = (student) => {
  console.log('View button clicked for student:', student);
  console.log('Navigating with ID:', student.id);
  console.log('Student also has studentId:', student.studentId);
  navigate(`/admin/student-profile/${student.id}`);
};

  const goBack = () => {
    navigate('/admin/student-list');
  };

  return (
    <>
      {/* Header with Back Arrow and Title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={goBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Go back to class selection"
          >
            <FiArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold">Students in {className}</h1>
        </div>
        
        {/* Weekly Limit Info Button */}
        <button
          onClick={() => setShowLimitInfo(!showLimitInfo)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <FiInfo size={20} />
          <span className="text-sm font-medium">Weekly Limit: ₦{WEEKLY_LIMIT.toLocaleString()}</span>
        </button>
      </div>

      {/* Weekly Limit Info Panel */}
      {showLimitInfo && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Weekly Withdrawal Limit Information</h3>
          <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
            <li>Each student has a weekly withdrawal limit of <span className="font-bold">₦{WEEKLY_LIMIT.toLocaleString()}</span></li>
            <li>The limit resets every Monday at 12:00 AM</li>
            <li>For withdrawals beyond the limit, use <span className="font-bold">Special Shopping</span> (No Limit)</li>
            <li>Deposits have no limits</li>
            <li>Click the status badge to toggle Active/Inactive</li>
          </ul>
          <button
            onClick={() => navigate('/admin/student-info')}
            className="mt-3 text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Go to Special Shopping
          </button>
        </div>
      )}

      {/* Student Count Badge */}
      <div className="mb-4 text-sm text-gray-600">
        Total Students: {students.length}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Student ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">House</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Balance (₦)</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-mono text-sm">{student.studentId || student.id}</td>
                <td className="p-3 font-medium">{student.name}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    student.house === "Red" ? "bg-red-100 text-red-800" :
                    student.house === "Blue" ? "bg-blue-100 text-blue-800" :
                    student.house === "Green" ? "bg-green-100 text-green-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {student.house}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleToggleStatus(student)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      student.status 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    } transition-colors`}
                    title="Click to toggle status"
                  >
                    <FiToggleLeft size={14} />
                    {student.status ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="p-3 font-medium">₦{(student.balance || 0).toLocaleString()}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDepositMoney(student)} 
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      title="Deposit money"
                    >
                      Deposit
                    </button>
                    <button 
                      onClick={() => viewProfile(student)} 
                      className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-900"
                      title="View full profile"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {students.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No students found in {className}</p>
          <button
            onClick={() => navigate('/admin/add-student')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Add a new student →
          </button>
        </div>
      )}

      {/* Deposit Modal */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => {
          setShowDepositModal(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        onConfirm={confirmDeposit}
      />
    </>
  );
};

export default ClassStudents;