import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web.js";

// init app
let app=express();

// connect database
connectDB();

//config view engine 
configViewEngine(app);

let port=9899;
let hostname="localhost";
initRoutes(app);

app.listen(port,hostname,()=>{
  console.log("ban dang chay o "+hostname+":"+port );
});