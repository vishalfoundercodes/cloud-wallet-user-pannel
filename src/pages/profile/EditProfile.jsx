import React, { useState } from 'react';
import { Camera, User, Mail, Phone, Hash, CloudSnow } from 'lucide-react';
import axios from 'axios';
import apis from '../../utils/apis';
import { toast } from "react-toastify";

const EditProfile = ({ userData, onUpdate ,setActiveTab }) => {
  const userId = localStorage.getItem("user_id");
  const [formData, setFormData] = useState({
    fullName: userData.fullName,
    phone: userData.phone,
    email: userData.email
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = {
        id: userId,
        name: formData.fullName,
        phone: formData.phone // agar API me phone update allowed hai
      };

      const response = await axios.post(apis?.update_profile, payload);
      console.log("update_profile", response);
      console.log("update_profile payload", payload);
      
      if (response.data.Success) {
        toast.success(response.data.message); // Successfully updated
        onUpdate && onUpdate(formData);
         setActiveTab && setActiveTab("overview"); // parent component ko updated data bhej do
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message||'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
const handleCancel = () => {
  setActiveTab && setActiveTab("overview");
};
  return (
    <div className="bg-white dark:bg-richblack-900 rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center mb-4">
        <User className="w-5 h-5 mr-3 text-gray-600 dark:text-richblack-100" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-richblack-5">
          Edit Personal Information
        </h2>
      </div>

      <p className="text-gray-500 mb-8 text-sm dark:text-richblack-400">
        Update your personal details. <i className='dark:text-[#47A5C5]'>Changes will be reviewed before being applied</i>.
      </p>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-3 dark:text-richblack-25">
            Full Name <span className='text-pink-200'>*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-richblack-800
                dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)] dark:text-richblack-25
                border-0 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
              placeholder="John Doe"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-3 dark:text-richblack-25">
            Email Address <span className='text-pink-200'>*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-richblack-800
                dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)] dark:text-richblack-25
                border-0 rounded-lg text-gray-500 cursor-not-allowed"
              placeholder="john.doe@example.com"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-3 dark:text-richblack-25">
            Phone Number <span className='text-pink-200'>*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-richblack-800
                dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)] dark:text-richblack-25
                border-0 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        {/* Account ID */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-3 dark:text-richblack-25">
            Account ID <span className='text-pink-200'>*</span>
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={userData.accountId}
              disabled
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-richblack-800
                dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)] dark:text-richblack-25
                border-0 rounded-lg text-gray-500 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Account ID cannot be changed</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button onClick={handleCancel}
          className="flex w-[50%] items-center justify-center px-6 py-3 bg-white dark:bg-richblack-600
          dark:border-richblack-800 dark:hover:bg-richblack-700 dark:text-richblack-25 border border-gray-300
          rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
        >
          <span className="mr-2">✕</span>
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className={`flex w-[50%] items-center justify-center px-6 py-3
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-900'}
            text-white rounded-xl transition-colors font-semibold whitespace-nowrap`}
        >
          <span className="mr-2">💾</span>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
