var express= require("express");
var app=express();

var port=9899;
var hostname="localhost";

app.get("/helloworld",(req,res) =>{
  res.send("<h1>Hello world</h1>");
});

app.listen(port,hostname,()=>{
  console.log("ban dang chay o localhost:9899/helloworld");
});