import React from "react";
import LoginImg from "../assets/login.jpeg";
import css from "./index.module.css"

const Login = () => {

    return(
        <>
        <div className={css.login_page}>
            <img src={LoginImg} width={"50%"} />
        </div>
        </>
    )
}

export default Login