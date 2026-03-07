import React, { useState } from "react";
import { UserPlus, ArrowLeft, Save, Upload, X } from "lucide-react";
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
    amount: 0,
    parentPhone: "",
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Please upload an image less than 5MB.');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (jpg, png, etc.)');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    // Reset the file input
    document.getElementById('student-image').value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate a unique ID for the student
    const newId = Date.now();
    const studentId = `STU${String(newId).slice(-4)}`;

    const newStudent = {
      id: newId,
      studentId: studentId,
      name: formData.name,
      className: formData.className,
      house: formData.house,
      balance: Number(formData.amount) || 0,
      status: true,
      parentPhone: formData.parentPhone || '',
      image: imagePreview || null, // Store the image as base64 string
      createdAt: new Date().toISOString()
    };

    dispatch(addStudent(newStudent));

    alert(`✅ Student added successfully!\n\nStudent ID: ${studentId}\nName: ${formData.name}\nClass: ${formData.className}`);

    // Redirect to the class page
    navigate(`/admin/student-list/${formData.className}`);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={goBack}
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
          
          {/* Student Image Upload */}
          <div className="md:col-span-2 flex flex-col items-center mb-4">
            <label className="text-sm font-medium text-gray-700 mb-3">Student Photo</label>
            
            {!imagePreview ? (
              <div className="w-full max-w-md">
                <label 
                  htmlFor="student-image" 
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition group"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-2" />
                    <p className="mb-2 text-sm text-gray-500 group-hover:text-blue-600">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG, JPEG (Max 5MB)</p>
                  </div>
                  <input 
                    id="student-image" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Student preview" 
                  className="w-48 h-48 object-cover rounded-lg border-2 border-blue-500 shadow-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Almustapha Muhammad"
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange}
              value={formData.name}
            />
          </div>

          {/* Parent Phone (replacing DOB) */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Parent/Guardian Phone
            </label>
            <input
              type="tel"
              name="parentPhone"
              placeholder="e.g. 08012345678"
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange}
              value={formData.parentPhone}
            />
          </div>

          {/* Class Selection */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Assign Class <span className="text-red-500">*</span>
            </label>
            <select
              name="className"
              required
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              onChange={handleChange}
              value={formData.className}
            >
              <option value="">Select Class</option>
              <option value="JSS1A">JSS 1A</option>
              <option value="JSS1B">JSS 1B</option>
              <option value="JSS1C">JSS 1C</option>
              <option value="JSS1D">JSS 1D</option>
              <option value="JSS2A">JSS 2A</option>
              <option value="JSS2B">JSS 2B</option>
              <option value="JSS2C">JSS 2C</option>
              <option value="JSS2D">JSS 2D</option>
              <option value="JSS3A">JSS 3A</option>
              <option value="JSS3B">JSS 3B</option>
              <option value="JSS3C">JSS 3C</option>
              <option value="JSS3D">JSS 3D</option>
              <option value="SS1A">SS 1A</option>
              <option value="SS1B">SS 1B</option>
              <option value="SS1C">SS 1C</option>
              <option value="SS1D">SS 1D</option>
              <option value="SS2A">SS 2A</option>
              <option value="SS2B">SS 2B</option>
              <option value="SS2C">SS 2C</option>
              <option value="SS2D">SS 2D</option>
              <option value="SS3A">SS 3A</option>
              <option value="SS3B">SS 3B</option>
              <option value="SS3C">SS 3C</option>
              <option value="SS3D">SS 3D</option>
            </select>
          </div>

          {/* House Selection */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              House <span className="text-red-500">*</span>
            </label>
            <select
              name="house"
              required
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              onChange={handleChange}
              value={formData.house}
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
              min="0"
              step="100"
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange}
              value={formData.amount}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            <Save size={18} className="mr-2" /> Save Student
          </button>
        </div>
      </form>

      {/* Quick Tips */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">📝 Quick Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Student ID will be automatically generated (e.g., STU1234)</li>
          <li>• Upload a clear photo of the student for identification</li>
          <li>• Initial deposit is optional - can be added later</li>
          <li>• Parent phone number helps with communication</li>
        </ul>
      </div>
    </div>
  );
};

export default AddStudent;