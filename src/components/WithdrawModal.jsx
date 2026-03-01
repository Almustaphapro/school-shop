import React from 'react';

const WithdrawModal = ({ isOpen, onClose, student, withdrawAmount, onWithdrawAmountChange, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Withdraw Funds</h3>
        <p className="text-gray-600 mb-4">Student: {student?.name}</p>
        <p className="text-sm text-gray-500 mb-2">Available Balance: ₦{(student?.balance || 0).toLocaleString()}</p>
        
        <input
          type="number"
          placeholder="Enter amount to withdraw"
          value={withdrawAmount}
          onChange={(e) => onWithdrawAmountChange(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
          >
            Confirm Withdrawal
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;