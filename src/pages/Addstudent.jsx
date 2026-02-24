import React, { useState } from "react";
import { UserPlus, ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";  
import { addStudent } from "../features/students/studentSlice";

const AddStudent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    className: "",
    house: "",
    gender: "",
    dob: "",
    amount: 0,
    parentPhone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = (e) => {
  e.preventDefault();

  const newStudent = {
    id: `STU${Date.now()}`, // auto ID
    name: formData.name,
    className: formData.className,
    house: formData.house,
    gender: formData.gender,
    dob: formData.dob,
    balance: Number(formData.amount) || 0,
    status: "Active",
  };

  dispatch(addStudent(newStudent));

  alert("Student added successfully!");

  // ✅ Redirect to that specific class page
  navigate(`/admin/student-list/${formData.className}`);
};
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-blue-600 transition mb-2"
          >
            <ArrowLeft size={18} className="mr-1" /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Enroll New Student</h1>
        </div>
        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
          <UserPlus size={28} />
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white shadow-sm border border-gray-100 rounded-xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Almustapha Muhammad"
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange}
            />
          </div>

          {/* Class Selection */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Assign Class</label>
            <select
              name="className"
              required
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              onChange={handleChange}
            >
              <option value="">Select Class</option>
              <option value="JSS1A">JSS 1A</option>
              <option value="JSS1B">JSS 1B</option>
              <option value="JSS1C">JSS 1C</option>
              <option value="JSS1D">JSS 1D</option>
                <option value="JSS2A">JSS 2A</option>
            </select>
          </div>

          {/* House Selection */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">House</label>
            <select
              name="house"
              required
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              onChange={handleChange}
            >
              <option value="">Select House</option>
              <option value="Red">Red House</option>
              <option value="Blue">Blue House</option>
              <option value="Green">Green House</option>
              <option value="Yellow">Yellow House</option>
            </select>
          </div>

          {/* Initial Deposit */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Initial Deposit (₦)</label>
            <input
              type="number"
              name="amount"
              placeholder="0.00"
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange}
            />
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              name="dob"
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange}
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Gender</label>
            <div className="flex space-x-4 mt-2">
              <label className="flex items-center">
                <input type="radio" name="gender" value="Male" onChange={handleChange} className="mr-2" /> Male
              </label>
              <label className="flex items-center">
                <input type="radio" name="gender" value="Female" onChange={handleChange} className="mr-2" /> Female
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-10 pt-6 border-t border-gray-50 flex justify-end">
          <button
            type="submit"
            className="flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            <Save size={18} className="mr-2" /> Save Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;