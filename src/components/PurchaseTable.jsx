import React from 'react';
import { FiShoppingBag } from 'react-icons/fi';

const PurchaseTable = ({ purchases, onViewDetails, onAddNew }) => {
  if (purchases.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <FiShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Purchases Found</h3>
        <p className="text-gray-500 mb-4">Get started by adding your first purchase</p>
        <button
          onClick={onAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add New Purchase
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left text-sm font-semibold text-gray-600">Purchase ID</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-600">Date</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-600">Student</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-600">Items</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-600">Amount</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-600">Payment</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase.id} className="border-t hover:bg-gray-50">
              <td className="p-4 font-mono text-sm">{purchase.id}</td>
              <td className="p-4">{purchase.date}</td>
              <td className="p-4">
                <div>
                  <p className="font-medium">{purchase.studentName}</p>
                  <p className="text-xs text-gray-500">{purchase.studentId}</p>
                </div>
              </td>
              <td className="p-4">
                <div className="flex flex-col gap-1">
                  {purchase.items.map((item, idx) => (
                    <p key={idx} className="text-sm">
                      {item.quantity}x {item.name}
                    </p>
                  ))}
                </div>
              </td>
              <td className="p-4 font-medium">₦{purchase.totalAmount.toLocaleString()}</td>
              <td className="p-4 capitalize">{purchase.paymentMethod}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  purchase.status === 'completed' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {purchase.status}
                </span>
              </td>
              <td className="p-4">
                <button 
                  onClick={() => onViewDetails(purchase)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseTable;