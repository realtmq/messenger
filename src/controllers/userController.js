import multer from "multer";
import {app} from "./../config/app";
import {transErrors,transSuccess} from "./../../lang/vi";
import uuidv4 from "uuid/v4";
import {user} from "./../services/index";
import fsExtra from "fs-extra";
import {validationResult} from "express-validator/check";   

let storageAvatar = multer.diskStorage({
	destination:(req,file,callback)=>{
		callback(null,app.avatar_directory);
	},
	filename:(req,file,callback)=>{
		let match= app.avatar_type;
		if(match.indexOf(file.mimetype) === -1){
			return callback(transErrors.avatar_type_error,null);
		}
		let avatarName= Date.now()+uuidv4()+file.originalname;
		callback(null,avatarName);
	}
});

let avatarUploadFile= multer({
	storage: storageAvatar,
	limits: {fileSize: app.avatar_limit_size}
}).single("avatar");

let updateAvatar=(req,res)=> {
	avatarUploadFile(req,res,async (error)=>{
		if(error){
			//UPDATE THAT BAI
			if(error.message)
			{
				return res.status(500).send(transErrors.avatar_size_error);
			}
			return res.status(500).send(error);
		}
		//UPDATE THANH CONG
		//console.log(req.file);
		try{
			let updateUserItem={
				avatar: req.file.filename,
				updatedAt: Date.now()
			}
			//update user
			let userUpdate= await user.updateUser(req.user._id,updateUserItem);
			//console.log(userUpdate);
			//remove old avatar
			await fsExtra.remove(app.avatar_directory+"/"+userUpdate.avatar);
			let result={
				message:transSuccess.user_info_updated,
				imageSrc:"images/users/"+req.file.filename
			}
			return res.status(200).send(result);

		}catch(error){
			console.log(error);
			return res.status(500).send(error);
		}
	})
}

let  updateInfo = async (req,res)=>{

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
		let updateUserItem = req.body;
		await user.updateUser(req.user._id,updateUserItem);

		let result={
				message:transSuccess.user_info_updated
			};
		return res.status(200).send(result);

	}catch(error){
		console.log(error);
		return res.status(500).send(error);
	}
}

module.exports={
	updateInfo:updateInfo,
	updateAvatar:updateAvatar
}