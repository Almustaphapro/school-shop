import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getStudentsByClass } from "../data/studentData";
import { FiArrowLeft } from "react-icons/fi"; // Import back arrow icon

const ClassStudents = () => {
  const { className } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Get static students for this class
    const classStudents = getStudentsByClass(className);
    setStudents(classStudents);
  }, [className]);

  const toggleStatus = (id) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: !s.status } : s))
    );
  };

  const depositMoney = (id) => {
    const amount = prompt("Enter deposit amount:");
    if (!amount || isNaN(amount)) return;
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, balance: s.balance + Number(amount) } : s))
    );
  };

  const viewProfile = (student) => {
    alert(`Name: ${student.name}
Student ID: ${student.studentId}
Class: ${className}
House: ${student.house}
Balance: ₦${student.balance.toLocaleString()}
Status: ${student.status ? "Active" : "Inactive"}`);
  };

  const goBack = () => {
    navigate(-1); // This goes back to the previous page (student list)
    // Alternative: navigate('/admin/student-list') if you want to go directly to student list
  };

  return (
    <>
      {/* Header with Back Arrow and Title */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={goBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Go back to class selection"
        >
          <FiArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold">Students in {className}</h1>
      </div>

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
              <th className="p-3 text-left">Deposit</th>
              <th className="p-3 text-left">Profile</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-mono text-sm">{student.studentId}</td>
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
                    onClick={() => toggleStatus(student.id)}
                    className={`px-3 py-1 rounded text-white text-sm ${
                      student.status ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {student.status ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="p-3 font-medium">₦{student.balance.toLocaleString()}</td>
                <td className="p-3">
                  <button 
                    onClick={() => depositMoney(student.id)} 
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Deposit
                  </button>
                </td>
                <td className="p-3">
                  <button 
                    onClick={() => viewProfile(student)} 
                    className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-900"
                  >
                    View
                  </button>
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
            onClick={goBack}
            className="mt-4 text-blue-600 hover:underline"
          >
            ← Back to class selection
          </button>
        </div>
      )}
    </>
  );
};

export default ClassStudents;