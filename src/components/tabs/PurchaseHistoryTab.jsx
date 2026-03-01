import React from 'react';
import { FiDownload } from 'react-icons/fi';

const PurchaseHistoryTab = () => {
  // Sample purchase history - in real app, this would come from props/Redux
  const purchases = [
    { date: '2024-02-15', item: 'School Uniform', amount: 15000, status: 'Completed' },
    { date: '2024-02-10', item: 'Mathematics Textbook', amount: 8500, status: 'Completed' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Purchase History</h3>
        <button className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
          <FiDownload /> Export
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Date</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Item</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Amount</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase, index) => (
              <tr key={index} className="border-t">
                <td className="p-3">{purchase.date}</td>
                <td className="p-3">{purchase.item}</td>
                <td className="p-3 font-medium">₦{purchase.amount.toLocaleString()}</td>
                <td className="p-3">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    {purchase.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseHistoryTab;