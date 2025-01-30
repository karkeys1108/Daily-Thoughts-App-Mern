import axios from "axios";
import React, { useState } from "react";
import ChangePassword from "../components/ChangePassword";

export default function ForgetPassword() {
  const [optSent, setOptSent] = useState(false);
  const [loading, setLoading] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const sendOTP = async (event) => {
    event.preventDefault();
    if (email == "") {
      setErrorMessage("please enter email id");
      return;
    }
    setLoading(true);
    try {
      const url = import.meta.env.VITE_BASE_URL;
      const res = await axios.post(`${url}/sendotp`, { email });
      console.log(res);
      setOptSent(res.data.success)
      setLoading(false);
    } catch (err) {
      console.log("error while creating diary");
      console.log(err);
      setLoading(false);
      setErrorMessage(err.response.data.message);
    }
  };

  return !optSent ? (
    <div className="w-full flex justify-center items-center h-full px-2">
      <div className="bg-black bg-opacity-20  text-slate-200 px-4 py-5 rounded-md shadow-lg">
        <form onSubmit={sendOTP} className="flex flex-col gap-2">
          <div className="flex flex-col items-start">
            <label htmlFor="email">Email id:</label>
            <input
              className="px-2 py-1 rounded-md bg-transparent border-white border w-full outline-none"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setErrorMessage("");
                setEmail(e.target.value);
              }}
              type="email"
              placeholder="Enter Your email"
            />
            {errorMessage !== "" && (
              <p className="text-xs font-bold text-red-500">{errorMessage}</p>
            )}
          </div>
          <button
            type="submit"
            className="font-bold mt-2 bg-green-700 hover:bg-green-800 w-fit mx-auto px-4 py-1 rounded-md"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  ) : (
    <ChangePassword setOptSent={setOptSent} email={email} />
  );
}
