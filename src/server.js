import express from "express";
import connectDB from "./config/connectDB";
import ContactModel from "./models/contact.model";
let app=express();
connectDB();
let port=9899;
let hostname="localhost";

app.get("/helloworld",async (req,res) =>{
	try{
		let item={
			userId:"wsdfghfg",
			contactId:"safdsadfsfa"
		};
		let contact= await ContactModel.createNew(item);
		res.send(contact);

	}catch(err){
		console.log(err);
	}
});

app.listen(port,hostname,()=>{
  console.log("ban dang chay o localhost:9899/helloworld");
});