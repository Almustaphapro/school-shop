import React from 'react';
import { FiUser, FiHome, FiCalendar, FiToggleLeft, FiCreditCard } from 'react-icons/fi';
const StudentProfileCard = ({ student, onDeposit, onWithdraw, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
         
<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
  {student.image ? (
    <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
  ) : (
    <FiUser size={32} className="text-blue-600" />
  )}
</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
            <p className="text-gray-500">Student ID: {student.studentId || student.id}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <FiHome className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">House</p>
                  <p className="font-medium">{student.house}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Class</p>
                  <p className="font-medium">{student.className}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-xs text-gray-500">Balance</p>
                  <p className="font-medium text-green-600">₦{(student.balance || 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiToggleLeft className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className={`font-medium ${student.status ? 'text-green-600' : 'text-red-600'}`}>
                    {student.status ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onDeposit(student)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            Deposit
          </button>
          <button
            onClick={() => onWithdraw(student)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
          >
            <FiCreditCard /> Withdraw
          </button>
          <button
            onClick={() => onToggleStatus(student)}
            className={`${student.status ? 'bg-orange-600' : 'bg-green-600'} text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2`}
          >
            <FiToggleLeft /> {student.status ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileCard;