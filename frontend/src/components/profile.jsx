import React, { useState } from "react";
import SidebarF from "./sidebarFixed";

const ProfilePage = () => {
  const [name, setName] = useState("Priyanshu Raj");
  const [email, setEmail] = useState("priyanshu@gmail.com");
  const [mobile, setMobile] = useState("");
  const [location, setLocation] = useState("India");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex h-screen">
      <div className="fixed left-0 top-0 h-full bg-white shadow-md border-r">
  <SidebarF />
</div>
      <div className="flex-1 flex justify-center items-center ml-[280px] bg-gray-100 shadow-inner overflow-y-auto p-6">
        <div className="w-[550px] bg-white shadow-xl rounded-xl p-6 border">
          {/* Profile Header */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src="photo.jpg"
                  alt="Profile"
                  className="w-16 h-16 rounded-full"
                />
              </div>
              <div>
                <p className="font-semibold text-lg">{name}</p>
                <p className="text-sm text-gray-500">{email}</p>
              </div>
            </div>
            <button 
              className="bg-purple-700 text-white px-4 py-1 rounded hover:bg-purple-900"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          {/* Profile Fields */}
          <div className="mt-4 space-y-4">
            <ProfileField label="Name" value={name} setValue={setName} isEditing={isEditing} />
            <ProfileField label="Email account" value={email} setValue={setEmail} />
            <ProfileField
              label="Mobile number"
              value={mobile || "Add number"}
              setValue={setMobile}
              isPlaceholder={!mobile}
              isEditing={isEditing}
            />
            <ProfileField label="Location" value={location} setValue={setLocation} isEditing={isEditing} />
          </div>

          {/* Save Button */}
          {isEditing && (
            <button className="mt-6 w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-900">
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ Fixed ProfileField Component
const ProfileField = ({ label, value, setValue, isPlaceholder, isEditing }) => (
  <div className="flex justify-between items-center border-b pb-2">
    <span className="text-gray-600">{label}</span>
    {isEditing ? (
      <input
        type="text"
        className={`text-right focus:outline-none ${
          isPlaceholder ? "text-blue-500 cursor-pointer" : "text-black"
        }`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    ) : (
      <span className="text-black">{value}</span>
    )}
  </div>
);

export default ProfilePage;
