import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../api/config";

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const role = location.state?.role;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = role === "teacher" 
        ? api.teacherVerifyOtp 
        : api.studentVerifyOtp;

      const response = await axios.post(endpoint, {
        userOtp: otp
      });

      if (response.data.msg) {
        toast.success("Registration successful!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "OTP verification failed");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
          OTP Verification
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Please enter the OTP sent to your email
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength="4"
            placeholder="Enter 4-digit OTP"
            className="w-full p-3 border border-gray-300 rounded-md mb-4 text-center text-2xl tracking-wider"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-purple-700 text-white p-3 rounded-md hover:bg-purple-800 transition"
          >
            Verify OTP
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Didn't receive OTP? 
          <button 
            className="text-purple-700 ml-2 hover:underline"
            onClick={() => navigate("/signup")}
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;