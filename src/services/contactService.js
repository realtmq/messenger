import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import _ from "lodash";
let findUsersContact=(currentUserId,keyword)=>{
  return new Promise(async (resolve,reject)=>{
  	let deprecatedUserIds= [currentUserId];
  	let contactByUser= await contactModel.findAllByUser(currentUserId); //TRA VE 1 MANG,BEN TRONG CHUA CAC DOI TUONG CHUA USER-ID,CONTACTID
    contactByUser.forEach((contact)=>{
  		deprecatedUserIds.push(contact.userId);
  		deprecatedUserIds.push(contact.contactId);
  	});
  	
    deprecatedUserIds= _.uniqBy(deprecatedUserIds);
    //console.log(deprecatedUserIds);
     //LOAI BO CAC PHAN TU TRUNG NHAU
    let users= await userModel.findAllForAddContact(keyword,deprecatedUserIds);
    resolve(users);
   });
}

let addNew=(currentUserId,contactId)=>{
	return new Promise(async (resolve,reject)=>{
		let contactExist=await contactModel.checkExistRelationship(currentUserId,contactId);
		if(contactExist)
			{return reject(false);}
		let newContactItem={
			userId:currentUserId,
			contactId:contactId
		}
	    let newContact=await contactModel.createNew(newContactItem);
	    resolve(newContact);
	});
}

let undoAddContact=(currentUserId,contactId)=>{
	return new Promise(async (resolve,reject)=>{
		let removeReq= await contactModel.removeContact(currentUserId,contactId);
		if(removeReq.result.n===0)
			{return reject(false);}
		resolve(removeReq.result.n);
	});
}

module.exports={
	addNew:addNew,
    findUsersContact:findUsersContact,
    undoAddContact:undoAddContact
}