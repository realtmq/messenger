import express from "express";
import {home,auth,user,contact,notification,message} from "./../controllers/index.js";
import {authValid,userValid,messageValid} from "./../validation/index";
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

    router.put("/user/update-password",auth.checkLoggedin,userValid.updatePassword,user.updatePassword);

    router.get("/contact/find-users/:keyword",auth.checkLoggedin,contact.findUsersContact);

    router.post("/contact/add-new",auth.checkLoggedin,contact.addNew);

    router.delete("/contact/undo-add-contact",auth.checkLoggedin,contact.undoAddContact);

    router.delete("/contact/delete-add-friend-request",auth.checkLoggedin,contact.deleteAddFriendRequest);

    router.put("/contact/accept-add-friend-request",auth.checkLoggedin,contact.acceptAddFriendRequest);

    router.delete("/contact/unfriend",auth.checkLoggedin,contact.unfriend);

    router.get("/notification/read-more",auth.checkLoggedin,notification.readMore);

    router.get("/contact/read-more-contacts",auth.checkLoggedin,contact.readMoreContact);

    router.get("/contact/read-more-contacts-sent",auth.checkLoggedin,contact.readMoreContactSent);

    router.get("/contact/read-more-contacts-received",auth.checkLoggedin,contact.readMoreContactReceived);

    router.put("/notification/mark-all-as-read",auth.checkLoggedin,notification.markAllAsRead);

    router.post("/message/add-new-text-emoji",auth.checkLoggedin,messageValid.checkMessageLength,message.addNewTextEmoji);



    return app.use("/",router);

};

module.exports=initRoutes;