import axios from "axios";
import React, { useState } from "react";

export default function SignupForm({ setshowLogin }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordWarning, setPasswordWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    setPasswordWarning("");
    setErrorMessage("");
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    
    // ✅ Fix: Strict check for password match
    if (formData.password !== formData.confirmPassword) {
      setPasswordWarning("Passwords do not match");
      return;
    }

    setLoading(true);
    const url = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

    try {
      const res = await axios.post(`${url}/api/v1/signup`, formData);

      // ✅ Fix: Properly clear the form data
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setLoading(false);
      setshowLogin(true);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Signup failed. Please try again.");
      console.error("Error while signing up:", err);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F02F34] bg-opacity-20 text-[#E7D3BB] px-4 py-5 rounded-md shadow-lg">
      <form onSubmit={handleSignup} className="flex flex-col gap-2">
        <div className="flex flex-col items-start">
          <label htmlFor="name">Name:</label>
          <input
            required
            className="px-2 py-1 rounded-md bg-transparent border-[#E7D3BB] border-[0.5px] w-full outline-none"
            id="name"
            name="name"
            value={formData.name}
            type="text"
            onChange={handleChange}
            placeholder="Enter Your Name"
          />
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="email">Email:</label>
          <input
            required
            className="px-2 py-1 rounded-md bg-transparent border-[#E7D3BB] border w-full outline-none"
            id="email"
            name="email"
            value={formData.email}
            type="email"
            onChange={handleChange}
            placeholder="Enter Your Email"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            required
            className="px-2 py-1 rounded-md bg-transparent border-[#E7D3BB] border w-full outline-none"
            id="password"
            name="password"
            value={formData.password}
            type="password"
            onChange={handleChange}
            placeholder="Enter Your Password"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            required
            className="px-2 py-1 rounded-md bg-transparent border-[#E7D3BB] border w-full outline-none"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            type="password"
            onChange={handleChange}
            placeholder="Confirm Your Password"
          />
          {passwordWarning && <div className="text-xs font-bold text-[#F02F34]">{passwordWarning}</div>}
          {errorMessage && <div className="text-xs font-bold text-[#F02F34]">{errorMessage}</div>}
        </div>
        <button type="submit" className="bg-[#F02F34] hover:bg-red-800 w-fit mx-auto px-4 py-1 rounded-md">
          {loading ? "Signing up..." : "SignUp"}
        </button>
      </form>
      <div className="w-full border-t border-[#E7D3BB] my-3"></div>
      <div className="w-full flex justify-start gap-2">
        <p>Already have an account?</p>
        <span onClick={() => setshowLogin(true)} className="underline cursor-pointer text-[#F02F34]">
          Login
        </span>
      </div>
    </div>
  );
}
