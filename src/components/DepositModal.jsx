import React, { useState } from 'react';
import { FiX, FiDollarSign } from 'react-icons/fi';

const DepositModal = ({ isOpen, onClose, student, onConfirm }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    onConfirm(student.id, Number(amount), description);
    setAmount('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Deposit Funds</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <FiX size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Student Info */}
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-blue-800 font-medium">Student: {student?.name}</p>
            <p className="text-xs text-blue-600 mt-1">ID: {student?.studentId || student?.id}</p>
            <p className="text-xs text-blue-600">Class: {student?.className}</p>
          </div>

          {/* Current Balance */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Current Balance</p>
            <p className="text-2xl font-bold text-green-600">₦{(student?.balance || 0).toLocaleString()}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Amount Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deposit Amount (₦) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                 
                  className="w-full pl-8 pr-4 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  autoFocus
                  required
                />
              </div>
            </div>

            {/* Description Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., School fees, Pocket money, etc."
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* New Balance Preview */}
            {amount && Number(amount) > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New Balance:</span>
                  <span className="font-bold text-blue-600">
                    ₦{((student?.balance || 0) + Number(amount)).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
              >
                 Confirm Deposit
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Quick Tips */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <span className="font-bold">💡 Tip:</span> Deposits are added to the student's balance immediately and can be used for purchases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;