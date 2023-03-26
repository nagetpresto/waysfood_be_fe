import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function PrivateRoute() {
    const [state, dispatch] = useContext(UserContext);
    const isSignIn = state.isLogin;
    const status = state.user.status;

  return isSignIn === true ? <Outlet /> : <Navigate to="/" />;
}