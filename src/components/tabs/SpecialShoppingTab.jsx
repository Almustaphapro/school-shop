import React, { useState } from 'react';
import { FiMinus } from 'react-icons/fi';

const SpecialShoppingTab = ({ student, onProcessDeduction }) => {
  const [customDeduction, setCustomDeduction] = useState('');
  const [deductionDescription, setDeductionDescription] = useState('');
  const [remainingBalancePreview, setRemainingBalancePreview] = useState(0);

  const handleDeduction = () => {
    if (!customDeduction || Number(customDeduction) <= 0) {
      alert('Please enter a valid deduction amount');
      return;
    }

    if (Number(customDeduction) > (student.balance || 0)) {
      alert('Insufficient balance!');
      return;
    }

    const confirmMessage = `Process special deduction 
    of ₦${Number(customDeduction).toLocaleString()} from
     ${student.name}'s account?\n\nThis is a special deduction with NO LIMIT.`;
    
    if (window.confirm(confirmMessage)) {
      //Dispatch withdrawal action with all needed data
      onProcessDeduction(
        Number(customDeduction),
         deductionDescription || 'Special shopping deduction (No limit)');

         // Clear inputs
      setCustomDeduction('');
      setDeductionDescription('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Instructions & Info */}
      <div className="lg:col-span-2">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Special Shopping (No Limit)</h3>
          <p className="text-sm text-blue-700">
            This is special shopping mode with <span className="font-bold">NO WEEKLY LIMIT</span>. 
            Students can deduct any amount from their balance for special purchases or emergencies.
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Important Information</h3>
          <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
            <li>Regular shopping has a weekly limit of ₦1,500</li>
            <li>Special shopping has <span className="font-bold">NO LIMIT</span></li>
            <li>All special deductions are logged for audit purposes</li>
            <li>Ensure you have sufficient balance before processing</li>
          </ul>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Current Balance</p>
            <p className="text-2xl font-bold text-blue-600">₦{(student.balance || 0).toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Special Shopping</p>
            <p className="text-2xl font-bold text-green-600">No Limit</p>
          </div>
        </div>
      </div>

      {/* Right Column - Deduction Input */}
      <div className="lg:col-span-1">
        <div className="bg-gray-50 rounded-lg p-4 sticky top-4 border-2 border-blue-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            Special Deduction
          </h3>
          
          {/* Current Balance Display */}
          <div className="bg-white p-4 rounded-lg mb-4 border border-blue-100">
            <p className="text-sm text-gray-500 mb-1">Available Balance</p>
            <p className="text-3xl font-bold text-blue-600">₦{(student.balance || 0).toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              Special Mode: No Limit
            </p>
          </div>

          {/* Deduction Amount Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deduction Amount (₦) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
              <input
                type="number"
                value={customDeduction}
                onChange={(e) => {
                  const value = e.target.value;
                  setCustomDeduction(value);
                  const deductionAmount = Number(value) || 0;
                  setRemainingBalancePreview((student.balance || 0) - deductionAmount);
                }}
                placeholder="0.00"
                min="0"
                step="100"
                className="w-full pl-8 pr-4 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            {customDeduction && Number(customDeduction) > (student?.balance || 0) && (
              <p className="text-red-500 text-xs mt-1">
                ⚠️ Amount exceeds available balance!
              </p>
            )}
          </div>

          {/* Remaining Balance Preview */}
          {customDeduction && (
            <div className="bg-white p-3 rounded-lg mb-4 border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Remaining Balance:</span>
                <span className={`font-bold ${Number(customDeduction) > (student?.balance || 0) ? 'text-red-600' : 'text-green-600'}`}>
                  ₦{Math.max(0, (student?.balance || 0) - Number(customDeduction)).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Description Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description/Reason <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              value={deductionDescription}
              onChange={(e) => setDeductionDescription(e.target.value)}
              placeholder="e.g., Emergency funds, Special permission, School event, etc."
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="3"
            />
          </div>

          {/* Special Shopping Checkbox */}
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={true}
                disabled
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Special Shopping Mode <span className="text-blue-600">(No Limit)</span>
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              This deduction will not count towards the weekly ₦1,500 limit
            </p>
          </div>

          {/* Process Deduction Button */}
          <button
            onClick={handleDeduction}
            disabled={!customDeduction || Number(customDeduction) <= 0 || Number(customDeduction) > (student?.balance || 0)}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
              customDeduction && Number(customDeduction) > 0 && Number(customDeduction) <= (student?.balance || 0)
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <FiMinus /> Process Special Deduction
          </button>

          {/* Quick Tips */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs font-medium text-blue-800 mb-1">ℹ️ About Special Shopping:</p>
            <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
              <li>No weekly limit - can deduct any amount</li>
              <li>Perfect for emergencies or special permissions</li>
              <li>All deductions are logged for accountability</li>
              <li>Balance updates in real-time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialShoppingTab;