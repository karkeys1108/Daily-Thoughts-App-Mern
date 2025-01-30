import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useDispatch } from "react-redux";
import { changeLoggedIn } from "../store/loginSlice";

export default function Diary() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      dispatch(changeLoggedIn(false));
      navigate("/");
    }
  }, [token]);

  const [deleteButton, setDeleteButton] = useState("Delete");
  const { diaryId } = useParams();
  const [loading, setLoading] = useState(false);
  const [diary, setDiary] = useState(null);
  const [edit, setEdit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatedDiary, setUpdatedDiary] = useState("");

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleDelete = async () => {
    setDeleteButton("Deleting...");
    try {
      await axios.delete(`${baseUrl}/api/v1/deletediary/${diaryId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
  
      setDeleteButton("Delete");
      navigate("/dashboard"); // Only navigate after successful deletion
    } catch (err) {
      console.error("Error while deleting", err);
      setDeleteButton("Delete");
    }
  };
  

  const handleEdit = async () => {
    if (!edit) {
      setEdit(true);
      setUpdatedDiary(diary?.body);
      return;
    }
  
    try {
      const res = await axios.put(
        `${baseUrl}/api/v1/updatediary/${diaryId}`,  
        { body: updatedDiary }, 
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setDiary(res.data); 
      setEdit(false);
    } catch (err) {
      console.error("Error while updating diary", err);
    }
  };
  
  


  const getDiary = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/v1/getdiary`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { diaryId },
        withCredentials: true,
      });
      setDiary(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrorMessage("No diary found");
    }
  };

  useEffect(() => {
    getDiary();
  }, []);

  return (
    <div className="w-full">
      <NavBar />
      {loading ? (
        <h1 className="w-full items-center text-xl flex flex-col gap-2 max-w-[1080px] px-2 py-10 mx-auto">
          Loading...
        </h1>
      ) : (
        diary && (
          <div className="w-full hideScrollbar h-[90%] flex flex-col gap-2 max-w-[1080px] px-2 py-10 mx-auto">
            <div className="font-bold flex w-full justify-between">
              <h1>{`Date ${diary?.date}`}</h1>
              <div className="flex gap-3">
                <button onClick={handleEdit}>{edit ? "Save" : "Edit"}</button>
                <button onClick={handleDelete}>{deleteButton}</button>
              </div>
            </div>
            {!edit ? (
              <textarea
                readOnly
                className="text-[16px] outline-none md:text-[18px] bg-black  bg-opacity-10 text-slate-400 overflow-scroll h-[80vh] px-4 py-4 rounded-md hideScrollbar shadow-sm"
                value={diary?.body}
              ></textarea>
            ) : (
              <textarea
                onChange={(e) => setUpdatedDiary(e.target.value)}
                value={updatedDiary}
                className="text-[16px]  md:text-[18px] bg-black bg-opacity-10 text-slate-400 overflow-scroll h-[80vh] px-4 py-4 rounded-md hideScrollbar shadow-sm outline-none"
              ></textarea>
            )}
          </div>
        )
      )}
      {errorMessage !== "" && (
        <p className="w-full font-bold text-xl flex flex-col gap-2 max-w-[1080px] px-2 py-10 mx-auto">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
