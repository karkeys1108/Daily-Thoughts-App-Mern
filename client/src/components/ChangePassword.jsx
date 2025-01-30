import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword({ email, setOptSent }) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState("");
  const handleChange = (event) => {
    setPasswordWarning("");
    setErrorMessage("");
    const nameToChange = event.target.name;
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [nameToChange]: value }));
  };
  const handleSignup = async (event) => {
    event.preventDefault();
    if (formData.password != formData.confirmPassword) {
      setPasswordWarning("password do not match");
      return;
    }
    setLoading(true);
    const url = import.meta.env.VITE_BASE_URL;
    try {
      formData.email = email;
      const res = await axios.post(`${url}/resetpassword`, formData);

      formData.code = "";
      formData.email = "";
      formData.password = "";
      formData.confirmPassword = "";
      navigate("/");
      setLoading(false);
      setOptSent(false);
    } catch (err) {
      setErrorMessage(err.response.data.message);
      console.log("Error while reseting password");
      setLoading(false);
    }
  };
  return (
    <div className="w-full flex justify-center items-center h-full px-2">
        
      <div className="bg-black bg-opacity-20  text-slate-200 px-4 py-5 rounded-md shadow-lg">
      <h1 className="text-center font-bold text-xl">Reset Password</h1>
        <form onSubmit={handleSignup} className="flex flex-col gap-2">
          <div className="flex flex-col items-start">
            <label htmlFor="code">OTP:</label>
            <input
              required
              className="px-2 py-1 rounded-md bg-transparent border-slate-500 border-[0.5px] w-full outline-none"
              id="code"
              name="code"
              value={formData.code}
              type="text"
              onChange={handleChange}
              placeholder="Enter OTP sent to your mail"
            />
          </div>
          <div>
            <label htmlFor="password"> Password:</label>
            <input
              required
              className="px-2 py-1 rounded-md bg-transparent border-slate-500 border w-full outline-none"
              id="password"
              name="password"
              value={formData.password}
              type="password"
              onChange={handleChange}
              placeholder="Enter Your password"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              required
              className="px-2 py-1 rounded-md bg-transparent border-slate-500 border w-full outline-none"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              type="password"
              onChange={handleChange}
              placeholder="Enter Your password"
            />
            {passwordWarning !== "" && (
              <div className="text-xs font-bold text-red-500">
                {passwordWarning}
              </div>
            )}
            {errorMessage !== "" && (
              <div className="text-xs font-bold text-red-500">
                {errorMessage}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="border border-slate-500 w-fit mx-auto px-4 py-1 rounded-md"
          >
            {loading ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
