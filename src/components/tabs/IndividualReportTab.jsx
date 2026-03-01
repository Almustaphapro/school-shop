import React from 'react';

const IndividualReportTab = ({ student }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Student Financial Report</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 mb-1">Total Deposits</p>
          <p className="text-2xl font-bold text-blue-800">₦{(student.balance || 0).toLocaleString()}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 mb-1">Total Purchases</p>
          <p className="text-2xl font-bold text-green-800">₦40,500</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600 mb-1">Current Balance</p>
          <p className="text-2xl font-bold text-purple-800">₦{(student.balance || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Recent Activity</h4>
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b">
            <span>Deposit on Feb 15, 2024</span>
            <span className="text-green-600">+₦10,000</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>Purchase - School Uniform</span>
            <span className="text-red-600">-₦15,000</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>Deposit on Feb 10, 2024</span>
            <span className="text-green-600">+₦20,000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualReportTab;