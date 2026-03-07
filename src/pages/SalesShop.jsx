import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiSearch, 
  FiUser, 
  FiHome, 
  FiCalendar, 
  FiDollarSign,
  FiShoppingBag,
  FiArrowLeft,
  FiCreditCard,
  FiToggleLeft,
  FiMinus
} from 'react-icons/fi';
import { withdrawMoney } from '../features/students/studentSlice';

const SalesShop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allStudents = useSelector((state) => state.students.students);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Filter students based on search
  const filteredStudents = allStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.studentId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (filteredStudents.length > 0) {
      setSelectedStudent(filteredStudents[0]);
    }
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || isNaN(withdrawAmount)) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (Number(withdrawAmount) > (selectedStudent.balance || 0)) {
      alert('Insufficient balance!');
      return;
    }

    if (Number(withdrawAmount) <= 0) {
      alert('Please enter an amount greater than 0');
      return;
    }

    dispatch(withdrawMoney({ 
      id: selectedStudent.id, 
      amount: Number(withdrawAmount),
      description: 'Salesrep withdrawal',
      isSpecial: false
    }));
    
    alert(`✅ Withdrawal of ₦${withdrawAmount} processed successfully!`);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  const handleSpecialDeduction = (amount, description) => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amount > (selectedStudent.balance || 0)) {
      alert('Insufficient balance!');
      return;
    }

    dispatch(withdrawMoney({ 
      id: selectedStudent.id, 
      amount: amount,
      description: description || 'Special shopping deduction',
      isSpecial: true
    }));
    
    alert(`✅ Special deduction of ₦${amount.toLocaleString()} processed successfully!`);
  };

  const selectStudent = (student) => {
    setSelectedStudent(student);
    setSearchTerm('');
  };

  const goBack = () => {
    setSelectedStudent(null);
    setSearchTerm('');
  };

  // Render profile tab
  const renderProfileTab = () => {
    if (!selectedStudent) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Student Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Full Name</span>
              <span className="font-medium">{selectedStudent.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Student ID</span>
              <span className="font-medium font-mono">{selectedStudent.studentId || selectedStudent.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Class</span>
              <span className="font-medium">{selectedStudent.class || selectedStudent.className}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">House</span>
              <span className={`font-medium ${
                selectedStudent.house === "Red" ? "text-red-600" :
                selectedStudent.house === "Blue" ? "text-blue-600" :
                selectedStudent.house === "Green" ? "text-green-600" :
                "text-yellow-600"
              }`}>
                {selectedStudent.house} House
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Status</span>
              <span className={`font-medium ${selectedStudent.status ? 'text-green-600' : 'text-red-600'}`}>
                {selectedStudent.status ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">Current Balance</p>
            <p className="text-3xl font-bold text-blue-800">₦{(selectedStudent.balance || 0).toLocaleString()}</p>
            
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-xs text-blue-600 mb-2">Quick Actions</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition flex items-center justify-center gap-1"
                >
                  <FiCreditCard size={14} /> Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render special shopping tab
  const renderSpecialShoppingTab = () => {
    if (!selectedStudent) return null;

    return (
      <div className="space-y-4">
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
          <h3 className="font-semibold text-purple-800 mb-2">Special Shopping (No Limit)</h3>
          <p className="text-sm text-purple-700">
            This is special shopping mode with <span className="font-bold">NO WEEKLY LIMIT</span>. 
            Use this for special permissions or emergency withdrawals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-4">Quick Deduction</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Amount (₦)</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  id="specialAmount"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Emergency funds"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  id="specialDescription"
                />
              </div>
              <button
                onClick={() => {
                  const amount = document.getElementById('specialAmount').value;
                  const description = document.getElementById('specialDescription').value;
                  handleSpecialDeduction(Number(amount), description);
                  document.getElementById('specialAmount').value = '';
                  document.getElementById('specialDescription').value = '';
                }}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-medium"
              >
                Process Special Deduction
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-medium mb-4">Available Balance</h4>
            <p className="text-3xl font-bold text-purple-600 mb-4">₦{(selectedStudent.balance || 0).toLocaleString()}</p>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Regular withdrawals: Limited to ₦1,500/week
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Special shopping: No limit
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {selectedStudent ? (
            <button
              onClick={goBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Back to search"
            >
              <FiArrowLeft size={24} className="text-gray-700" />
            </button>
          ) : null}
          <h1 className="text-2xl font-bold text-gray-800">
            {selectedStudent ? 'Student Details' : 'Student Shop'}
          </h1>
        </div>
      </div>

      {/* Search Section - Only show when no student selected */}
      {!selectedStudent && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Enter student name or ID (e.g., STU0001)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Search
            </button>
          </form>

          {/* Search Results */}
          {searchTerm && filteredStudents.length > 0 && (
            <div className="mt-4 border border-gray-200 rounded-lg bg-white shadow-lg max-h-96 overflow-y-auto">
              {filteredStudents.map(student => (
                <div
                  key={student.id}
                  onClick={() => selectStudent(student)}
                  className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-lg">{student.name}</p>
                      <p className="text-sm text-gray-500">
                        ID: {student.studentId || student.id} | Class: {student.class || student.className} | House: {student.house}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Balance</p>
                      <p className="font-bold text-green-600">₦{(student.balance || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchTerm && filteredStudents.length === 0 && (
            <div className="mt-4 p-8 text-center text-gray-500 border border-gray-200 rounded-lg">
              <FiUser size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-lg font-medium mb-1">No students found</p>
              <p className="text-sm">Try a different name or ID</p>
            </div>
          )}

          {/* Search Tips */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800 mb-2">🔍 Search Tips</p>
            <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>Search by Student ID: STU0001, STU0002, etc.</li>
              <li>Search by Name: Oluwaseun, Chiamaka, etc.</li>
              <li>Click on any result to view full details</li>
            </ul>
          </div>
        </div>
      )}

      {/* Student Details - Show when student selected */}
      {selectedStudent && (
        <div className="space-y-6">
          {/* Student Profile Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <FiUser size={32} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800">{selectedStudent.name}</h2>
                <p className="text-gray-500">Student ID: {selectedStudent.studentId || selectedStudent.id}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <FiHome className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">House</p>
                      <p className="font-medium">{selectedStudent.house}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Class</p>
                      <p className="font-medium">{selectedStudent.class || selectedStudent.className}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiDollarSign className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Balance</p>
                      <p className="font-medium text-green-600">₦{(selectedStudent.balance || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiToggleLeft className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className={`font-medium ${selectedStudent.status ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedStudent.status ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiUser className="inline mr-2" /> Profile Details
              </button>
              <button
                onClick={() => setActiveTab('shop')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'shop'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiShoppingBag className="inline mr-2" /> Special Shopping
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-md p-6">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'shop' && renderSpecialShoppingTab()}
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Withdraw Funds</h3>
            <p className="text-gray-600 mb-2">Student: {selectedStudent.name}</p>
            <p className="text-sm text-gray-500 mb-4">Available Balance: ₦{(selectedStudent.balance || 0).toLocaleString()}</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Withdraw</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleWithdraw}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Confirm Withdrawal
              </button>
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount('');
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <p>⚠️ Regular withdrawals are limited to ₦1,500 per week.</p>
              <p>Use Special Shopping for amounts above the limit.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesShop;