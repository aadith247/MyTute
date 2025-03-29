import React, { useEffect, useRef } from "react";
import { Bell, User, Settings, LogOut, Book, X } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      {/* Sidebar */}
      <div ref={sidebarRef} className="w-64 bg-white shadow-lg p-4 border-r h-full flex flex-col transition-transform duration-300">
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={onClose}>
          <X size={20} />
        </button>

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
          <MenuItem icon={<User size={18} />} text="My Profile" />
          <MenuItem icon={<Book size={18} />} text="My Course" />
          <MenuItem icon={<Settings size={18} />} text="Settings" />
          <MenuItem icon={<Bell size={18} />} text="Notifications" />
        </div>

        {/* Log Out */}
        <MenuItem icon={<LogOut size={18} />} text="Log Out" className="text-red-500 mt-auto" />
      </div>
    </div>
  );
};

// Generic Menu Item
const MenuItem = ({ icon, text, className = "" }) => (
  <div className={`flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer ${className}`}>
    {icon}
    <span>{text}</span>
  </div>
);

export default Sidebar;
