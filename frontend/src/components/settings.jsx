import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/config';
import Sidebar from './sideBar';

export const Settings = () => 
{
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [theme, setTheme] = useState('light');
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    // Here you would implement theme switching logic
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmed) {
      try {
        const token = localStorage.getItem('token');
        // Implement account deletion API call here
        toast.success('Account deleted successfully');
        navigate('/');
      } catch (error) {
        toast.error('Failed to delete account');
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (user.newPassword !== user.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
      toast.success('Settings updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  return (
    <>
    <div className="flex h-screen">
    <div className="fixed left-0 top-0 h-full bg-white shadow-md border-r">
<Sidebar />
</div>
    <div className="min-h-screen bg-gray-100 flex-1 flex justify-center items-center ml-[280px] shadow-inner overflow-y-auto p-6">
      <div className="w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
        
          <div className="bg-gradient-to-r from-purple-700 to-purple-500 p-6">
            <h1 className="text-2xl font-bold text-white">Account Settings</h1>
            <p className="text-purple-100">Manage your account preferences and settings</p>
          </div>
          <div className="p-6 space-y-6">
           
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-purple-700 mb-4">Change Password</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={user.currentPassword}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={user.newPassword}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={user.confirmPassword}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </section>


            {/* Theme Section */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-purple-700 mb-4">Theme</h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`px-4 py-2 rounded-md ${
                    theme === 'light'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`px-4 py-2 rounded-md ${
                    theme === 'dark'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Dark
                </button>
              </div>
            </section>

      
            <section>
              <h2 className="text-xl font-semibold text-purple-700 mb-4">Account Actions</h2>
              <div className="space-y-4">
               
                <div className="flex space-x-4">
                  
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
    </div>

    </>

  );
};

