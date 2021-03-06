import {validationResult} from "express-validator/check";
import {auth} from "./../services/index";
import {transSuccess} from "./../../lang/vi";

let getLoginRegister = (req,res)=>{
	return res.render("auth/master",{
		errors: req.flash("errors"),
		success:req.flash("success")
	});
};

let postRegister=async (req,res)=>{
	let errorArray=[];
	let successArray=[];
    let validationErrors= validationResult(req);
    if(!validationErrors.isEmpty())
    {
    	let errors=Object.values(validationErrors.mapped());
    	errors.forEach((item)=>{
    		errorArray.push(item.msg);
    	});
    	req.flash("errors", errorArray);
    	return res.redirect("/login-register");
    }

    try{
    	let createUserSuccess = await auth.register(req.body.email,req.body.gender,req.body.password);
    	successArray.push(createUserSuccess);
    	req.flash("success", successArray);
    	return res.redirect("/login-register");
    }catch(error){
    	errorArray.push(error);
    	req.flash("errors", errorArray);
    	return res.redirect("/login-register");
    }
    
}; 

let verifyAccount =async (req,res)=>{
	try{
		
	    let successArray=[];
		let verifySuccess= await auth.verifyAccount(req.params.token);
		successArray.push(verifySuccess);
		req.flash("success",successArray);
		return res.redirect("/login-register");
	}catch(error){
		let errorArray=[];
		errorArray.push(error);
		req.flash("errors",errorArray);
        return res.redirect("/login-register");
	}
    
};

let getLogout =(req,res)=>{
	req.logout(); //remove session passport
	req.flash("success",transSuccess.logout_success);
	return res.redirect("/login-register"); 
};

let checkLoggedin=(req,res,next)=>{
	if(!req.isAuthenticated())
	return res.redirect("/login-register");
    next();
};

let checkLoggedout=(req,res,next)=>{
	if(req.isAuthenticated())
	return res.redirect("/");
    next();
};

module.exports={
	getLoginRegister:getLoginRegister,
	postRegister:postRegister,
	verifyAccount:verifyAccount,
	getLogout:getLogout,
	checkLoggedout:checkLoggedout,
	checkLoggedin:checkLoggedin
};