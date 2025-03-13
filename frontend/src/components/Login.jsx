import React from "react";
import fevicon from "../assets/fevicon.jpg";
import GoogleSvg from "../assets/icons8-google.svg";

const Login = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden w-[900px]">
        {/* Left Section */}
        <div className="w-1/2 p-8 bg-purple-100 border border-purple-400">
          <h2 className="text-purple-700 text-3xl font-bold mb-4 text-center">
            Welcome to <span className="text-purple-900">MyTute !</span>
          </h2>
          <hr className="border-purple-500 mb-4" />
          <h3 className="text-black text-lg font-semibold text-center mb-4">Login to Your Account</h3>
          <form>
            <input
              type="email"
              placeholder="Email ID"
              className="w-full p-2 mb-3 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Role"
              className="w-full p-2 mb-3 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <button className="w-full bg-purple-700 text-white p-2 rounded">
              Login
            </button>
          </form>
        </div>

        {/* Right Section */}
        <div className="w-1/2 p-8 flex flex-col items-center justify-center">
          <img
            src={fevicon}
            alt="Educational Bird"
            className="w-48 h-48 mb-4"
          />
          <button className="w-full bg-white text-black border border-gray-300 p-2 rounded mb-4 flex items-center justify-center">
            <img
              src={GoogleSvg}
              alt="Google Icon"
              className="w-6 h-6 mr-2"
            />
            Sign in with Google
          </button>
          <button className="w-full bg-purple-700 text-white p-2 rounded">
            Create a New Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;