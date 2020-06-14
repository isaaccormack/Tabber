import GoogleSigninButton from "../icons/signin-google-icon.png";
import React, {useEffect, useState} from "react";
import "../component/LoginPage.css";



export default function GoogleLoginButton() {

    const [loginUrl, setLoginURL] = useState("");
    useEffect(() => {
        fetch("/api/loginUrl")
            .then(response => response.text())
            .then(data => setLoginURL(data));
    }, [loginUrl])

    return (
        <a className="centered" href={loginUrl}>
            <img className="google-button" src={GoogleSigninButton} alt={"google-button"}/>
        </a>
    );
}