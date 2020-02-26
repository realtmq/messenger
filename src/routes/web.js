import express from "express";
import {home,auth} from "./../controllers/index.js";
import {authValid} from "./../validation/index";
import passport from "passport";
import initPassportLocal from "./../controllers/passportController/local";

initPassportLocal();

let router= express.Router();


//init routes

let initRoutes= (app)=>{

// trang login
    router.get("/login-register",auth.checkLoggedout,auth.getLoginRegister);

    router.post("/register",auth.checkLoggedout,authValid.register,auth.postRegister);

    router.get("/verify/:token",auth.checkLoggedout,auth.verifyAccount);

    router.post("/login",auth.checkLoggedout,passport.authenticate("local",{
    	successRedirect:"/",
    	failureRedirect:"/login-register",
    	successFlash:true,
    	failureFlash:true
    }));

// trang home
	router.get("/",auth.checkLoggedin,home.getHome);
	
    router.get("/logout",auth.checkLoggedin,auth.getLogout )


    return app.use("/",router);

};

module.exports=initRoutes;