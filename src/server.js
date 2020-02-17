import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web.js";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session"

// init app
let app=express();

// connect database
connectDB();

//config session
configSession(app);

//config view engine 
configViewEngine(app);

//config body parser
app.use(bodyParser.urlencoded({extended:true}));

//config flash message
app.use(connectFlash());


let port=9899;
let hostname="localhost";

initRoutes(app);

app.listen(port,hostname,()=>{
  console.log("ban dang chay o "+hostname+":"+port );
});