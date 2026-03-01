import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleStudentStatus, depositMoney, withdrawMoney } from "../features/students/studentSlice";
import { FiArrowLeft, FiInfo } from "react-icons/fi";

const ClassStudents = () => {
  const { className } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get all students from Redux store
  const allStudents = useSelector((state) => state.students.students);
  
  // Filter students by class
  const [students, setStudents] = useState([]);
  const [weeklyWithdrawals, setWeeklyWithdrawals] = useState({});
  const [showLimitInfo, setShowLimitInfo] = useState(false);
  const WEEKLY_LIMIT = 1500; // ₦1,500 weekly limit

  useEffect(() => {
    // Filter students that belong to this class
    const classStudents = allStudents.filter(
      student => student.className === className
    );
    setStudents(classStudents);
    
    // Load weekly withdrawal data from localStorage
    loadWeeklyWithdrawals();
  }, [className, allStudents]);

  const loadWeeklyWithdrawals = () => {
    const stored = localStorage.getItem('weeklyWithdrawals');
    if (stored) {
      setWeeklyWithdrawals(JSON.parse(stored));
    }
  };

  const saveWeeklyWithdrawals = (data) => {
    localStorage.setItem('weeklyWithdrawals', JSON.stringify(data));
    setWeeklyWithdrawals(data);
  };

  const getWeekNumber = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneWeek = 604800000;
    const weekNumber = Math.floor(diff / oneWeek);
    return `${now.getFullYear()}-W${weekNumber}`;
  };

  const getStudentWeeklyWithdrawal = (studentId) => {
    const weekKey = getWeekNumber();
    return weeklyWithdrawals[`${studentId}-${weekKey}`] || 0;
  };

  const getRemainingLimit = (studentId) => {
    const withdrawn = getStudentWeeklyWithdrawal(studentId);
    return Math.max(0, WEEKLY_LIMIT - withdrawn);
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleStudentStatus(id));
  };

  const handleDepositMoney = (id) => {
    const amount = prompt("Enter deposit amount:");
    if (!amount || isNaN(amount)) return;
    dispatch(depositMoney({ id, amount: Number(amount) }));
  };

  const handleWithdrawMoney = (student) => {
    const remainingLimit = getRemainingLimit(student.id);
    
    if (remainingLimit <= 0) {
      alert(`⚠️ Weekly limit reached!\n\nThis student has already withdrawn ₦${WEEKLY_LIMIT.toLocaleString()} this week.\n\nPlease use Special Shopping for additional withdrawals.`);
      return;
    }

    const amount = prompt(
      `Enter withdrawal amount (Max: ₦${remainingLimit.toLocaleString()} this week):\n\n` +
      `Weekly limit: ₦${WEEKLY_LIMIT.toLocaleString()}\n` +
      `Already withdrawn: ₦${(WEEKLY_LIMIT - remainingLimit).toLocaleString()}\n` +
      `Remaining for this week: ₦${remainingLimit.toLocaleString()}`
    );
    
    if (!amount || isNaN(amount)) return;
    
    const numAmount = Number(amount);
    
    if (numAmount <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }
    
    if (numAmount > student.balance) {
      alert('Insufficient balance!');
      return;
    }
    
    if (numAmount > remainingLimit) {
      alert(`Amount exceeds weekly limit!\n\nMaximum allowed this week: ₦${remainingLimit.toLocaleString()}`);
      return;
    }

    // Process withdrawal
    dispatch(withdrawMoney({ 
      id: student.id, 
      amount: numAmount,
      description: 'Regular withdrawal',
      isSpecial: false
    }));

    // Update weekly withdrawal tracking
    const weekKey = getWeekNumber();
    const studentKey = `${student.id}-${weekKey}`;
    const currentWithdrawn = weeklyWithdrawals[studentKey] || 0;
    
    const updatedWithdrawals = {
      ...weeklyWithdrawals,
      [studentKey]: currentWithdrawn + numAmount
    };
    
    saveWeeklyWithdrawals(updatedWithdrawals);
    
    alert(`✅ Withdrawal of ₦${numAmount.toLocaleString()} successful!\n\nRemaining for this week: ₦${(remainingLimit - numAmount).toLocaleString()}`);
  };

  const viewProfile = (student) => {
    const remainingLimit = getRemainingLimit(student.id);
    alert(`Name: ${student.name}
Student ID: ${student.studentId || student.id}
Class: ${className}
House: ${student.house}
Balance: ₦${(student.balance || 0).toLocaleString()}
Status: ${student.status ? "Active" : "Inactive"}

--- Weekly Limit Info ---
Weekly Limit: ₦${WEEKLY_LIMIT.toLocaleString()}
Already Withdrawn: ₦${(WEEKLY_LIMIT - remainingLimit).toLocaleString()}
Remaining for Week: ₦${remainingLimit.toLocaleString()}`);
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
            <li>Withdrawals are tracked per student per week</li>
            <li>Once limit is reached, use <span className="font-bold">Special Shopping</span> for additional withdrawals</li>
            <li>Special Shopping has <span className="font-bold">NO LIMIT</span></li>
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
              <th className="p-3 text-left">Weekly Used</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const weeklyUsed = getStudentWeeklyWithdrawal(student.id);
              const remainingLimit = WEEKLY_LIMIT - weeklyUsed;
              const isLimitReached = remainingLimit <= 0;
              
              return (
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
                      onClick={() => handleToggleStatus(student.id)}
                      className={`px-3 py-1 rounded text-white text-sm ${
                        student.status ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {student.status ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-3 font-medium">₦{(student.balance || 0).toLocaleString()}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            weeklyUsed >= WEEKLY_LIMIT ? 'bg-red-600' : 
                            weeklyUsed > WEEKLY_LIMIT * 0.7 ? 'bg-yellow-600' : 'bg-green-600'
                          }`}
                          style={{ width: `${Math.min(100, (weeklyUsed / WEEKLY_LIMIT) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">
                        ₦{weeklyUsed.toLocaleString()}/{WEEKLY_LIMIT}
                      </span>
                    </div>
                    {isLimitReached && (
                      <span className="text-xs text-red-600 font-medium mt-1 block">
                        Limit reached
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDepositMoney(student.id)} 
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        title="Deposit money"
                      >
                        Deposit
                      </button>
                      <button 
                        onClick={() => handleWithdrawMoney(student)} 
                        disabled={!student.status || isLimitReached}
                        className={`px-3 py-1 rounded text-sm ${
                          !student.status || isLimitReached
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-orange-600 text-white hover:bg-orange-700'
                        }`}
                        title={isLimitReached ? 'Weekly limit reached. Use Special Shopping' : 'Withdraw money'}
                      >
                        Withdraw
                      </button>
                      <button 
                        onClick={() => viewProfile(student)} 
                        className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-900"
                        title="View profile"
                      >
                        View
                      </button>
                    </div>
                    {isLimitReached && student.status && (
                      <div className="mt-1">
                        <button
                          onClick={() => navigate('/admin/student-info')}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Use Special Shopping →
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
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
    </>
  );
};

export default ClassStudents;