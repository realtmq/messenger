import {contact} from "./../services/index";
let findUsersContact=async (req,res)=>{
	try{
		let currentUserId= req.user._id;
		let keyword=req.params.keyword;
		let users = await contact.findUsersContact(currentUserId,keyword); //get id,avatar...
		return res.render("main/contact/sections/_findUsersContact",{users});
	}catch(error){
		return res.status(500).send(error);
	}
};

let addNew=async(req,res)=>{
	try{
		let currentUserId=req.user._id;
		let contactId=req.body.uid;
		let newContact= await contact.addNew(currentUserId,contactId);
		return res.status(200).send({success: !!newContact});      
	}catch(error){
		return res.status(500).send(error);
	}
};

let undoAddContact=async(req,res)=>{
	try{
	let currentUserId=req.user._id;
	let contactId=req.body.uid;
	let removeReq=await contact.undoAddContact(currentUserId,contactId);
	return res.status(200).send({success:!!removeReq});
    }catch(error){
    	return res.status(500).send(error);
    }
};

let deleteAddFriendRequest =async (req,res)=>{
	try{
		let currentUserId=req.user._id;
		let contactId=req.body.uid;
		let removeReq=await contact.deleteAddFriendRequest(currentUserId,contactId);
		return res.status(200).send({success:!!removeReq});
	}catch(error){
		res.status(500).send(error);
	}
};

let acceptAddFriendRequest= async(req,res)=>{
	try{
		let currentUserId=req.user._id;
		let contactId=req.body.uid;
		let addFriend=await contact.acceptAddFriendRequest(currentUserId,contactId);
		return res.status(200).send({success:!!addFriend});
	}catch(error){
		return res.status(500).send(error);
	}
}

let readMoreContact=async(req,res)=>{
	try{
		let skipNumber=+(req.query.skipNumber);
		let newContactUsers= await contact.readMoreContact(req.user.id,skipNumber);
		return res.status(200).send(newContactUsers);
	}catch(error){
		return res.status(500).send(error);
	}
};

let readMoreContactSent= async(req,res)=>{
	try{
		let skipNumber=+(req.query.skipNumber);
		let newContactUsers= await contact.readMoreContactSent(req.user.id,skipNumber);
		return res.status(200).send(newContactUsers);
	}catch(error){
		return res.status(500).send(error);
	}
};

let readMoreContactReceived= async(req,res)=>{
	try{
		let skipNumber=+(req.query.skipNumber);
		let newContactUsers= await contact.readMoreContactReceived(req.user.id,skipNumber);
		return res.status(200).send(newContactUsers);
	}catch(error){
		return res.status(500).send(error);
	}
};

module.exports={
	addNew:addNew,
	findUsersContact:findUsersContact,
	undoAddContact:undoAddContact,
	readMoreContact:readMoreContact,
	readMoreContactSent:readMoreContactSent,
	readMoreContactReceived:readMoreContactReceived,
	deleteAddFriendRequest:deleteAddFriendRequest,
	acceptAddFriendRequest:acceptAddFriendRequest
}