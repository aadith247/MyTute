import React, { useState } from "react";
import { Bell, User, Settings, LogOut, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SidebarF = () => {
  const navigate = useNavigate();
  const [notificationOption, setNotificationOption] = useState("Allow");
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg p-4 border flex flex-col">
      {/* Profile Section */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <img src="photo.jpg" alt="Profile" className="w-12 h-12 rounded-full" />
        <div>
          <p className="font-semibold">Priyanshu Raj</p>
          <p className="text-sm text-gray-500">priyanshu@gmail.com</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="mt-4 space-y-2 flex-1">
        <MenuItem icon={<User size={18} />} text="My Profile" onClick={() => navigate("/profile")} />
        <MenuItem icon={<Book size={18} />} text="My Course" onClick={() => navigate("/course-card")} />
        <MenuItem icon={<Settings size={18} />} text="Settings" onClick={() => navigate("/settings")} />

        {/* Notification Dropdown */}
        <div className="relative flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer">
          <div className="flex items-center gap-3">
            <Bell size={18} />
            <span>Notification</span>
          </div>
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="text-blue-600 text-sm"
          >
            {notificationOption}
          </button>
          {showOptions && (
            <div className="absolute right-0 top-8 bg-white shadow-md rounded-md p-2 border">
              <DropdownItem text="Allow" setOption={setNotificationOption} setShowOptions={setShowOptions} />
              <DropdownItem text="Mute" setOption={setNotificationOption} setShowOptions={setShowOptions} />
            </div>
          )}
        </div>
      </div>

      {/* Log Out */}
      <MenuItem icon={<LogOut size={18} />} text="Log Out" className="text-red-500 mt-auto" onClick={() => navigate("/logout")} />
    </div>
  );
};

// Generic Menu Item
const MenuItem = ({ icon, text, onClick, className = "" }) => (
  <div className={`flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer ${className}`} onClick={onClick}>
    {icon}
    <span>{text}</span>
  </div>
);

// Dropdown Item
const DropdownItem = ({ text, setOption, setShowOptions }) => (
  <button
    className="block w-full text-left px-4 py-1 hover:bg-gray-200"
    onClick={() => {
      setOption(text);
      setShowOptions(false);
    }}
  >
    {text}
  </button>
);


