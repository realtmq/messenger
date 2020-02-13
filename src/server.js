import express from "express";
let app=express();
let port=9899;
let hostname="localhost";

app.get("/helloworld",(req,res) =>{
  res.send("<h1>Hello world</h1>");
});

app.listen(port,hostname,()=>{
  console.log("ban dang chay o localhost:9899/helloworld");
});