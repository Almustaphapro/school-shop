import React from 'react';

const PurchaseStatsCard = ({ title, value, icon, color, subtitle }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      icon: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      icon: 'text-green-600'
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      icon: 'text-purple-600'
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      icon: 'text-orange-600'
    }
  };

  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className={`text-2xl font-bold ${classes.text}`}>{value}</p>
        </div>
        <div className={`p-3 ${classes.bg} rounded-full`}>
          <div className={classes.icon}>{icon}</div>
        </div>
      </div>
      {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
    </div>
  );
};

export default PurchaseStatsCard;