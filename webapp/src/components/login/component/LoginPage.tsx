import React from "react";
import "./LoginPage.css";
import GoogleLoginButton from "./GoogleLoginButton";
import {useSelector} from "react-redux";
import RootState from "../../../store/root-state";
import {useHistory} from "react-router";



export default function LoginPage() {

    const history = useHistory();

    // Simple redirection, needs to be changed use cookies later
    const user = useSelector((state: RootState) => state.userState.user);
    if (window.location.pathname === "/login" && user) history.push("/");

    return (
        <div className='login-panel centered'>
            <GoogleLoginButton />
        </div>
    )
}