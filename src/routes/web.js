import express from "express";
import {home,auth,user} from "./../controllers/index.js";
import {authValid,userValid} from "./../validation/index";
import passport from "passport";
import initPassportLocal from "./../controllers/passportController/local";
import initPassportFacebook from "./../controllers/passportController/facebook";


initPassportLocal();
initPassportFacebook();

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

    router.get("/auth/facebook",passport.authenticate("facebook",{scope:["email"]}));
    router.get("/auth/facebook/callback",passport.authenticate("facebook",{
    	successRedirect:"/",
    	failureRedirect:"/login-register"
    }));

// trang home
	router.get("/",auth.checkLoggedin,home.getHome);
	
    router.get("/logout",auth.checkLoggedin,auth.getLogout );

    router.put("/user/update-avatar",auth.checkLoggedin,user.updateAvatar);

    router.put("/user/update-info",auth.checkLoggedin,userValid.updateInfo,user.updateInfo);


    return app.use("/",router);

};

module.exports=initRoutes;