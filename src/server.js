import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";

// init app
let app=express();

// connect database
connectDB();

//config view engine 
configViewEngine(app);

let port=9899;
let hostname="localhost";

app.get("/",(req,res) =>{
	return res.render("main/master");
});

app.get("/login-register",(req,res)=>{
	return res.render("auth/register");
});

app.listen(port,hostname,()=>{
  console.log("ban dang chay o "+hostname+":"+port );
});