import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { changeLoggedIn } from "../store/loginSlice";

export default function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const url = import.meta.env.VITE_BASE_URL;
      const res = await axios.delete(`${url}/logout`, {
        withCredentials: true,
      });
      sessionStorage.removeItem("token");
      dispatch(changeLoggedIn(false));
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      console.log(err);
      navigate("/");
    }
  };
  return (
    <div className="w-full font-semibold text-black h-fit mx-auto flex items-center shadow-sm">
      <div className="w-full py-2 h-fit px-4 mx-auto md:text-[18px] text-[16px] flex items-center justify-between max-w-[1080px]">
        <Link to="/dashboard" className="group">
          <h1 className="font-bold text-[18px] md:text-[20px]">Daily Thoughts</h1>
          <div className="w-0 group-hover:w-full transition-all duration-200 border-t-2 border-black"></div>
        </Link>
        <div className="flex gap-3 md:gap-5">
          <Link to="/createnew" className="group">
            <button className="font-bold">New Thought</button>
            <div className="w-0 group-hover:w-full transition-all duration-200 border-t-2 border-black"></div>
          </Link>
          <div onClick={handleLogout} className="group">
            <button className="font-bold">Log out</button>
            <div className="w-0 group-hover:w-full transition-all duration-200 border-t-2 border-black"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
