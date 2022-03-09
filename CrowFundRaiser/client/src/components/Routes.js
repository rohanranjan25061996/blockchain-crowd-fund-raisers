import React from "react";
import { Route, Routes } from "react-router-dom";
import FullHome from "./FullHome";
import Home from "./Home";
import Login from "./Login";

const Router = () => {

    return(
        <>
        <Routes>
            <Route exact path = "/" element = { <Login />}></Route>
            <Route exact path = "/home" element = {<Home />}></Route>
            <Route exact path = "/home/:id" element = {<FullHome />}></Route>
        </Routes>
        </>
    )
}

export default Router