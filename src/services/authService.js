import userModel from "./../models/userModel";
import bcrypt  from "bcrypt";
import uuidv4 from "uuid/v4";
import {transErrors,transSuccess,transMail} from "./../../lang/vi"; 
import sendMail from "./../config/mailer";

let saltRounds=7;

let register = (email,gender,password)=>{
	return new Promise(async (resolve,reject)=>{
	let userByEmail =await userModel.findByEmail(email);
	if(userByEmail){
	    if(userByEmail.deletedAt!=null)
	    {
	    	return reject(transErrors.account_is_deleted);
	    }
	    if(!userByEmail.local.isActive)
	    {
	    	return reject(transErrors.account_not_active);
	    }
		return reject(transErrors.account_in_use);
	}

	let salt= bcrypt.genSaltSync(saltRounds);
	let userItem={
		username: email.split("@")[0],
		gender:gender,
		local:{
			email:email,
			password:bcrypt.hashSync(password,salt),
			verifyToken:uuidv4()
		}
	};
	let user = await userModel.createNew(userItem);
	let linkVerify="http://localhost:9899/verify/"+user.local.verifyToken;
	sendMail(email,transMail.subject,transMail.template(linkVerify))
	.then(success=>{
		resolve(transSuccess.userCreated(user.local.email));
	})
	.catch(async error=>{
		await userModel.removeById(user._id);
		reject(transMail.trans_send_failed);
	});
    


	});
};

let  verifyAccount=(token)=>{
	return new Promise( async (resolve,reject)=>{
		let userByToken= await userModel.findByToken(token);
		if(!userByToken)
		{
			reject(transErrors.token_undefined);
		}
		await userModel.verify(token);
        resolve(transSuccess.accountActivated);
	});
};

module.exports ={
	register:register,
	verifyAccount:verifyAccount
}