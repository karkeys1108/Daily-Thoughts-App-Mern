import axios from "axios";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import ShowDiary from "../components/ShowDiary";
import { useDispatch } from "react-redux";
import { changeLoggedIn } from "../store/loginSlice";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const token = localStorage.getItem("token");
    // const token = sessionStorage.getItem("token");
    if(token === null||token===undefined){
      dispatch(changeLoggedIn(false));
      // navigate("/")
      return;
    }
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false)
  const getUserDetails = async () => {
    setLoading(true)
    try {
      const url = import.meta.env.VITE_BASE_URL;
      const res = await axios.get(`${url}/api/v1/getuser`, {
        withCredentials: true,
      });
      setUser(res.data.user);
      setLoading(false)
    } catch (err) {
      console.log(err);
      console.log(err.response.data.message);
      setLoading(false)

      navigate("/");
    }
  };
  useEffect(() => {
    getUserDetails();

  }, []);

  return (
    <div className="w-full h-full">
      <NavBar />
      {loading?<h1 className="w-full items-center text-xl flex flex-col gap-2 max-w-[1080px] px-2 py-10 mx-auto">Loading...</h1>:user && (
        <h1 className="font-bold text-center mt-3 text-xl">
          Welcome {user.name}
        </h1>
      )}
      {user?.diary && user.diary.length > 0 ? (
        <div className="w-full flex-wrap max-w-[1080px] mx-auto flex gap-x-3 sm:gap-x-10 gap-y-5 justify-center py-10">
          {user?.diary.map((d) => {
            return <ShowDiary key={d._id} diary={d} />;
          })}
        </div>
      ) : (
        !loading&&
        <div className="text-center mt-4">
          <p>You have not written any diary yet</p>
          <Link to="/createnew" className="group w-fit">
            <button className="underline font-bold text-[16px] md:text-[18px]">
              write diary
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
