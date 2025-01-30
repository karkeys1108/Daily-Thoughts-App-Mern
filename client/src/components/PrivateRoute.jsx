import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const loggedIn = useSelector((store) => store.loggedIn);
  if (loggedIn) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
}
