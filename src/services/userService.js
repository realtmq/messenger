import UserModel from "./../models/userModel";
import {transErrors} from "./../../lang/vi";
import bcrypt from "bcrypt";

const saltRounds=7;

let updateUser=(id,item)=>{
	return UserModel.updateUser(id,item);
};

let updatePassword=(id,item)=>{
	return new Promise(async (resolve,reject)=>{
		let currentUser= await UserModel.findUserById(id);
		if(!currentUser){
			return reject(transError.account_undefined);
		}
		let checkCurrentPassword = await currentUser.comparePassword(item.currentPassword);
		if(!checkCurrentPassword)
		{
			return reject(transErrors.password_invalid);
		}

		let salt= bcrypt.genSaltSync(saltRounds);
		await UserModel.updatePassword(id,bcrypt.hashSync(item.newPassword,salt));
		resolve(true);
	});

}

 module.exports={
 	updateUser:updateUser,
 	updatePassword:updatePassword
 }