import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiArrowLeft, FiUser } from 'react-icons/fi';


// Components
import StudentProfileCard from '../components/StudentProfileCard';
import StudentTabs from '../components/StudentTabs';
import WithdrawModal from '../components/WithdrawModal';
import DepositModal from '../components/DepositModal';


// Tab Components
import ProfileTab from '../components/tabs/ProfileTab';
import SpecialShoppingTab from '../components/tabs/SpecialShoppingTab';
import PurchaseHistoryTab from '../components/tabs/PurchaseHistoryTab';
import IndividualReportTab from '../components/tabs/IndividualReportTab';
import OverrideTab from '../components/tabs/OverrideTab';
import DeductionHistoryTab from '../components/tabs/DeductionHistoryTab';

// Actions
import { depositMoney, toggleStudentStatus, withdrawMoney } from '../features/students/studentSlice';

const StudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const allStudents = useSelector((state) => state.students.students);
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Find student by ID
  useEffect(() => {
    const foundStudent = allStudents.find(s => 
      s.id === studentId || s.studentId === studentId
    );
    setStudent(foundStudent);
  }, [studentId, allStudents]);

  const handleDeposit = (amount, description) => {
    dispatch(depositMoney({ id: student.id, amount }));
    alert(`✅ ₦${amount.toLocaleString()} deposited successfully!`);
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || isNaN(withdrawAmount)) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (Number(withdrawAmount) > (student.balance || 0)) {
      alert('Insufficient balance!');
      return;
    }

    dispatch(withdrawMoney({ 
      id: student.id, 
      amount: Number(withdrawAmount),
      description: 'Manual withdrawal'
    }));
    
    alert(`✅ Withdrawal of ₦${withdrawAmount} processed successfully!`);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  const handleToggleStatus = () => {
    if (window.confirm(`Are you sure you want to ${student.status ? 'deactivate' : 'activate'} ${student.name}?`)) {
      dispatch(toggleStudentStatus(student.id));
    }
  };

  const handleSpecialDeduction = (amount, description) => {
    dispatch(withdrawMoney({ 
      id: student.id, 
      amount: amount,
      description: description || 'Special shopping deduction (No limit)',
      isSpecial: true
    }));
    alert(`✅ Special deduction of ₦${amount.toLocaleString()} processed successfully!`);
  };

  const goBack = () => navigate(-1);

  // Render the appropriate tab based on activeTab
  const renderTab = () => {
    if (!student) return null;
    
    switch(activeTab) {
      case 'profile':
        return <ProfileTab student={student} />;
      case 'shop':
        return <SpecialShoppingTab 
                 student={student} 
                 onProcessDeduction={handleSpecialDeduction} 
               />;
      case 'history':
        return <PurchaseHistoryTab />;
      case 'reports':
        return <IndividualReportTab student={student} />;
      case 'override':
        return <OverrideTab />;
        case 'deductions':
        return <DeductionHistoryTab student={student} />;
      default:
        return null;
    }
  };

  if (!student) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={goBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Student Profile</h1>
        </div>
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FiUser size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Student Not Found</h3>
          <p className="text-gray-500">The student you're looking for doesn't exist.</p>
          <button
            onClick={goBack}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={goBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Go back"
        >
          <FiArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Student Profile</h1>
      </div>

      {/* Student Details */}
      <div className="space-y-6">
        {/* Student Profile Card */}
        <StudentProfileCard
          student={student}
          onDeposit={() => setShowDepositModal(true)}
          onWithdraw={() => setShowWithdrawModal(true)}
          onToggleStatus={handleToggleStatus}
        />

        {/* Tabs Navigation */}
        <StudentTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {renderTab()}
        </div>
      </div>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => {
          setShowDepositModal(false);
        }}
        student={student}
        onConfirm={(id, amount, description) => {
          handleDeposit(amount, description);
          setShowDepositModal(false);
        }}
      />

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => {
          setShowWithdrawModal(false);
          setWithdrawAmount('');
        }}
        student={student}
        withdrawAmount={withdrawAmount}
        onWithdrawAmountChange={setWithdrawAmount}
        onConfirm={handleWithdraw}
      />
    </div>
  );
};

export default StudentProfile;