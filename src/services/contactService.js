import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import _ from "lodash";
let findUsersContact=(currentUserId,keyword)=>{
  return new Promise(async (resolve,reject)=>{
  	let deprecatedUserIds= [];
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

module.exports={
    findUsersContact:findUsersContact
}