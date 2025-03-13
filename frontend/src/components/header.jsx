import React from "react";
import fevicon from "../assets/fevicon.jpg";
const Header = () => {
  return (
    <header className="bg-purple-100 flex items-center justify-between px-6 py-3 shadow-md">
      <div className="flex items-center space-x-3">
        <button className="text-purple-700 text-2xl">
          ☰
        </button>
        <div className="flex items-center space-x-2">
          <img src={fevicon} alt="Logo" className="w-8 h-8" />
          <h1 className="text-purple-700 text-xl font-bold">
            My<span className="text-purple-900">Tute</span>
          </h1>
        </div>
      </div>
      <button className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition">
        Join Course
      </button>
    </header>
  );
};

export default Header;
