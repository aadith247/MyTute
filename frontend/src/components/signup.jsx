import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import fevicon from "../assets/fevicon.jpg";
import GoogleSvg from "../assets/icons8-google.svg";
import { api } from "../api/config";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    confirmPass: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPass) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const endpoint = formData.role.toLowerCase() === "teacher" 
        ? api.teacherSignup 
        : api.studentSignup;
      
      const response = await axios.post(endpoint, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailId: formData.email,
        password: formData.password,
        confirmPass: formData.confirmPass
      });

      if (response.data.msg === "successfully sent the mail") {
        toast.success("OTP sent to your email!");
        navigate("/verify-otp", { state: { role: formData.role.toLowerCase() } });
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden w-[900px]">
        {/* Left Section */}
        <div className="w-1/2 p-8 bg-purple-100 border border-purple-400">
          <h2 className="text-purple-700 text-3xl font-bold mb-4 text-center">
            Welcome to <span className="text-purple-900">MyTute !</span>
          </h2>
          <hr className="border-purple-500 mb-4" />
          <h3 className="text-black text-lg font-semibold text-center mb-4">Create Account</h3>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-1/2 p-2 border border-gray-300 rounded"
                value={formData.firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-1/2 p-2 border border-gray-300 rounded"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              className="w-full p-2 mb-3 border border-gray-300 rounded"
              value={formData.email}
              onChange={handleChange}
            />
            <select
              name="role"
              className="w-full p-2 mb-3 border border-gray-300 rounded"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 mb-3 border border-gray-300 rounded"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPass"
              placeholder="Confirm Password"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              value={formData.confirmPass}
              onChange={handleChange}
            />
            <button 
              type="submit"
              className="w-full bg-purple-700 text-white p-2 rounded hover:bg-purple-800"
            >
              Sign up
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
          <button 
            onClick={() => navigate("/")}
            className="w-full bg-purple-700 text-white p-2 rounded hover:bg-purple-800"
          >
            Sign in with existing Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;