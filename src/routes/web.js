import express from "express";
import {home,auth} from "./../controllers/index.js";

let router= express.Router();


//init routes

let initRoutes= (app)=>{

	router.get("/",home.getHome);

    router.get("/login-register",auth.getLoginRegister);

    return app.use("/",router);
};

module.exports=initRoutes;