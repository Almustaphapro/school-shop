import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiArrowLeft, FiUser } from 'react-icons/fi';

// Components
import StudentSearch from '../components/StudentSearch';
import StudentProfileCard from '../components/StudentProfileCard';
import StudentTabs from '../components/StudentTabs';
import WithdrawModal from '../components/WithdrawModal';

// Tab Components
import ProfileTab from '../components/tabs/ProfileTab';
import SpecialShoppingTab from '../components/tabs/SpecialShoppingTab';
import PurchaseHistoryTab from '../components/tabs/PurchaseHistoryTab';
import IndividualReportTab from '../components/tabs/IndividualReportTab';
import OverrideTab from '../components/tabs/OverrideTab';

// Custom Hook
import { useStudentInfo } from '../hooks/useStudentInfo';

const StudentInformation = () => {
  const navigate = useNavigate();
  const allStudents = useSelector((state) => state.students.students);
  
  const {
    // State
    searchTerm,
    setSearchTerm,
    selectedStudent,
    activeTab,
    setActiveTab,
    withdrawAmount,
    setWithdrawAmount,
    showWithdrawModal,
    setShowWithdrawModal,
    
    // Actions
    handleDeposit,
    handleWithdraw,
    handleToggleStatus,
    handleSpecialDeduction,
    selectStudent
  } = useStudentInfo();

  // Filter students based on search
  const filteredStudents = allStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.studentId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    // Optional: Auto-select first result on search submit
    // if (filteredStudents.length > 0) {
    //   selectStudent(filteredStudents[0]);
    // }
  };

  const goBack = () => navigate(-1);

  // Render the appropriate tab based on activeTab
  const renderTab = () => {
    if (!selectedStudent) return null;
    
    switch(activeTab) {
      case 'profile':
        return <ProfileTab student={selectedStudent} />;
      case 'shop':
        return <SpecialShoppingTab 
                 student={selectedStudent} 
                 onProcessDeduction={handleSpecialDeduction} 
               />;
      case 'history':
        return <PurchaseHistoryTab />;
      case 'reports':
        return <IndividualReportTab student={selectedStudent} />;
      case 'override':
        return <OverrideTab />;
      default:
        return null;
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-800">Student Information</h1>
      </div>

      {/* Search Section */}
      <StudentSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={handleSearch}
        filteredStudents={filteredStudents}
        onSelectStudent={selectStudent}
      />

      {/* Student Details Section */}
      {selectedStudent ? (
        <div className="space-y-6">
          {/* Student Profile Card */}
          <StudentProfileCard
            student={selectedStudent}
            onDeposit={handleDeposit}
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
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FiUser size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Student Selected</h3>
          <p className="text-gray-500">Search for a student above to view their information</p>
        </div>
      )}

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => {
          setShowWithdrawModal(false);
          setWithdrawAmount('');
        }}
        student={selectedStudent}
        withdrawAmount={withdrawAmount}
        onWithdrawAmountChange={setWithdrawAmount}
        onConfirm={handleWithdraw}
      />
    </div>
  );
};

export default StudentInformation;