import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web.js";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session";
import passport from "passport";
import pem from "pem";
import https from "https";


pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
  if (err) {
    throw err
  }
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

//config passport
app.use(passport.initialize());
app.use(passport.session());

let port=9899;
let hostname="localhost";

initRoutes(app);

  https.createServer({ key: keys.serviceKey, cert: keys.certificate },app).listen(port,hostname,()=>{
    console.log("ban dang chay o "+hostname+":"+port );
  }); 

  ////////////////////////////////
})

// // init app
// let app=express();

// // connect database
// connectDB();

// //config session
// configSession(app);

// //config view engine 
// configViewEngine(app);

// //config body parser
// app.use(bodyParser.urlencoded({extended:true}));

// //config flash message
// app.use(connectFlash());

// //config passport
// app.use(passport.initialize());
// app.use(passport.session());

// let port=9899;
// let hostname="localhost";

// initRoutes(app);


// app.listen(port,hostname,()=>{
//   console.log("ban dang chay o "+hostname+":"+port );
// });