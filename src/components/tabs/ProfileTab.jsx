import React from 'react';
import { FiPhone } from 'react-icons/fi';

const ProfileTab = ({ student }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Full Name</span>
            <span className="font-medium">{student.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Gender</span>
            <span className="font-medium">{student.gender || 'Not specified'}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Date of Birth</span>
            <span className="font-medium">{student.dob || 'Not specified'}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Parent Phone</span>
            <span className="font-medium flex items-center gap-1">
              <FiPhone className="text-gray-400" />
              {student.parentPhone || 'Not specified'}
            </span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Academic Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Student ID</span>
            <span className="font-medium font-mono">{student.studentId || student.id}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Class</span>
            <span className="font-medium">{student.className}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">House</span>
            <span className="font-medium">{student.house}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Status</span>
            <span className={`font-medium ${student.status ? 'text-green-600' : 'text-red-600'}`}>
              {student.status ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;