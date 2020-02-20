import express from "express";
import {home,auth} from "./../controllers/index.js";
import {authValid} from "./../validation/index";

let router= express.Router();


//init routes

let initRoutes= (app)=>{
// trang home
	router.get("/",home.getHome);
// trang login
    router.get("/login-register",auth.getLoginRegister);

    router.post("/register",authValid.register,auth.postRegister);

    router.get("/verify/:token",auth.verifyAccount);

    return app.use("/",router);
};

module.exports=initRoutes;