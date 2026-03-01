import React, { useState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const OverrideTab = () => {
  const [overrideReason, setOverrideReason] = useState('');

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">System Override</h3>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <FiAlertCircle className="text-yellow-400 mr-3" size={20} />
          <div>
            <p className="font-medium text-yellow-700">Administrative Override Required</p>
            <p className="text-sm text-yellow-600">This action will be logged for audit purposes.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Override Reason
          </label>
          <textarea
            value={overrideReason}
            onChange={(e) => setOverrideReason(e.target.value)}
            placeholder="Explain why this override is necessary..."
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              if (!overrideReason) {
                alert('Please provide an override reason');
                return;
              }
              alert('Balance reset successfully!');
            }}
            className="bg-yellow-600 text-white p-3 rounded-lg hover:bg-yellow-700 transition"
          >
            Reset Student Balance
          </button>
          <button
            onClick={() => {
              if (!overrideReason) {
                alert('Please provide an override reason');
                return;
              }
              alert('Status override applied successfully!');
            }}
            className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition"
          >
            Force Status Change
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverrideTab;