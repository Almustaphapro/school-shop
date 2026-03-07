import React from 'react';
import { FiUser, FiShoppingBag, FiList, FiPieChart, FiLock } from 'react-icons/fi';

const StudentTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'profile', label: 'Profile Details', icon: <FiUser className="inline mr-2" /> },
    { id: 'shop', label: 'Special Shopping', icon: <FiShoppingBag className="inline mr-2" /> },
    { id: 'transactions', label: 'Transactions', icon: <FiList className="inline mr-2" /> },
    { id: 'override', label: 'Override', icon: <FiLock className="inline mr-2" /> }
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default StudentTabs;