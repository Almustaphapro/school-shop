import React from 'react';
import { FiCalendar, FiFilter } from 'react-icons/fi';

const DateFilter =({ startDate, endDate, onStartDateChange,
     onEndDateChange, onFilter, onReset }) => {
        return (
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <FiCalendar className="text-blue-600" />
        <h4 className="font-medium text-gray-700">Filter by Date</h4>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-3'>
                    <div>
                        <label className='block text-xs text-gray-500 mb-1'>Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => onStartDateChange(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg 
                            focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                    </div>
                    <div>
                        <label className='block text-xs text-gray-500 mb-1'>End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => onEndDateChange(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg 
                            focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onFilter}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm 
                         hover:bg-blue-700 transition flex items-center justify-center gap-1"
                    >
                        <FiFilter size={14} /> Apply Filter
                    </button>
                    <button
                        onClick={onReset}
                        className="flex-1 bg-gray-500 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                    >
                        Reset
                    </button>
            </div>
            </div>
        );
     }

     export default DateFilter;