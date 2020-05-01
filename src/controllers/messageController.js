import {validationResult} from "express-validator/check"; 
import message from "./../services/messageService";
import multer from "multer";
import {app} from "./../config/app";
import {transErrors,transSuccess} from "./../../lang/vi";
import fsExtra from "fs-extra";

let addNewTextEmoji =async (req,res)=>{
	let errorArr=[];
	let validationErrors=validationResult(req);

	if(!validationErrors.isEmpty()){
		let errors =Object.values(validationErrors.mapped());
		errors.forEach(item=>{
			errorArr.push(item.msg);
		});
		return res.status(500).send(errorArr); 
	}

	try{
		let sender={
			id:req.user._id,
			name:req.user.username,
			avatar:req.user.avatar
		}
		
		let receiverId= req.body.uid;
		let messageVal=req.body.messageVal;
		let isChatGroup=req.body.isChatGroup;
		
		let newMessage= await message.addNewTextEmoji(sender,receiverId,messageVal,isChatGroup);
		return res.status(200).send({message:newMessage}); 

	}catch(error){
		return res.status(500).send(error);
	}
}

let storageImageChat = multer.diskStorage({
	destination:(req,file,callback)=>{
		callback(null,app.image_message_directory);
	},
	filename:(req,file,callback)=>{
		let match= app.image_message_type;
		if(match.indexOf(file.mimetype) === -1){
			return callback(transErrors.image_message_type_error,null);
		}
		let imageName= file.originalname;
		callback(null,imageName);
	}
});

let imageMessageUploadFile= multer({
	storage: storageImageChat,
	limits: {fileSize: app.image_message_limit_size}
}).single("my-image-chat");

let sendMessageImage=(req,res)=>{
	imageMessageUploadFile(req,res,async(error)=>{
		if(error){
			//UPDATE THAT BAI
			if(error.message)
			{
				return res.status(500).send(transErrors.image_message_size_error);
			}
			return res.status(500).send(error);
		}
		try{
		let sender={
			id:req.user._id,
			name:req.user.username,
			avatar:req.user.avatar
		}
		
		let receiverId= req.body.uid;
		let messageVal=req.file;
		let isChatGroup=req.body.isChatGroup;
		
		let newMessage= await message.sendMessageImage(sender,receiverId,messageVal,isChatGroup);
		//xoa anh vi sau do luu tai mongodb
		fsExtra.remove(app.image_message_directory+"/"+newMessage.file.fileName);
		return res.status(200).send({message:newMessage}); 

	}catch(error){
		return res.status(500).send(error);
	}
	});
}

module.exports={
	addNewTextEmoji:addNewTextEmoji,
	sendMessageImage:sendMessageImage
}