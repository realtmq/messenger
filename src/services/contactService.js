import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import notificationModel from "./../models/notificationModel";
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
		//create contact item
		let newContactItem={
			userId:currentUserId,
			contactId:contactId
		}

		//create notification
		let newNotificationItem={
			senderId:currentUserId,
			receiverId:contactId,
			type: notificationModel.types.ADD_CONTACT
		}
		await notificationModel.model.createNew(newNotificationItem);


	    let newContact=await contactModel.createNew(newContactItem);
	    resolve(newContact);
	});
}

let undoAddContact=(currentUserId,contactId)=>{
	return new Promise(async (resolve,reject)=>{
		let removeReq= await contactModel.removeContact(currentUserId,contactId);
		if(removeReq.result.n===0)
			{return reject(false);}
		await notificationModel.model.removeRequestContactNotification(currentUserId,contactId,notificationModel.types.ADD_CONTACT);
		resolve(removeReq.result.n);
	});
}

let getContacts=(currentUserId)=>{
	return new Promise(async(resolve,reject)=>{
		try{
		let contacts=await contactModel.getContacts(currentUserId,10); //lay id 10 contact 
		let users= contacts.map(async (contact)=>{
			if(currentUserId == contact.contactId)
			{
				return await userModel.findUserById(contact.userId);
			}else{
			    return await userModel.findUserById(contact.contactId);
			}
		});	

		resolve(await Promise.all(users)); //do ham map tra ve 1 mang promise cac user
	    }catch(error){
	    	reject(error);
	    }
	});
}

let getContactsSent =(currentUserId)=>{
	return new Promise(async(resolve,reject)=>{
		try{
		let contacts=await contactModel.getContactsSent(currentUserId,10); //lay id 10 contact
		let users= contacts.map(async (contact)=>{
			return await userModel.findUserById(contact.contactId);
		});	

		resolve(await Promise.all(users)); //do ham map tra ve 1 mang promise cac user
	    }catch(error){
	    	reject(error);
	    }
	});
}

let getContactsReceived =(currentUserId)=>{
	return new Promise(async(resolve,reject)=>{
		try{
		let contacts=await contactModel.getContactsReceived(currentUserId,10); //lay id 10 contact 
		let users= contacts.map(async (contact)=>{
			return await userModel.findUserById(contact.userId);
		});	
		resolve(await Promise.all(users)); //do ham map tra ve 1 mang promise cac user
	    }catch(error){
	    	reject(error);
	    }
	});
}

let countAllContacts=(currentUserId)=>{
	return new Promise(async(resolve,reject)=>{
		try{
			let count= await contactModel.countAllContacts(currentUserId);
			resolve(count);
		}catch(error){
			reject(error);
		}
	})
}

let countAllContactsSent=(currentUserId)=>{
	return new Promise(async(resolve,reject)=>{
		try{
			let count= await contactModel.countAllContactsSent(currentUserId);
			resolve(count);
		}catch(error){
			reject(error);
		}
	})
}

let countAllContactsReceived=(currentUserId)=>{
	return new Promise(async(resolve,reject)=>{
		try{
			let count= await contactModel.countAllContactsReceived(currentUserId);
			resolve(count);
		}catch(error){
			reject(error);
		}
	})
}

let readMoreContact=(currentUserId,skipNumber)=>{
	return new Promise(async (resolve,reject)=>{
		try{
			let newContacts= await contactModel.readMoreContact(currentUserId,skipNumber,10); //10 la limit so user lay ra
			let users= newContacts.map(async(contact)=>{
				if(currentUserId == contact.contactId)
			    {
			 	return await userModel.findUserById(contact.userId);
			    }else{
			    return await userModel.findUserById(contact.contactId);
			    }
			});
			resolve(await Promise.all(users));
		}catch(error){
			reject(error);
		}
	});
} 

let readMoreContactSent=(currentUserId,skipNumber)=>{
	return new Promise(async (resolve,reject)=>{
		try{
			let newContacts= await contactModel.readMoreContactSent(currentUserId,skipNumber,10); //10 la limit so user lay ra
			let users= newContacts.map(async(contact)=>{
			    return await userModel.findUserById(contact.contactId);
			});
			resolve(await Promise.all(users));
		}catch(error){
			reject(error);
		}
	});
}

let readMoreContactReceived= (currentUserId,skipNumber)=>{
	return new Promise(async (resolve,reject)=>{
		try{
			let newContacts= await contactModel.readMoreContactReceived(currentUserId,skipNumber,10); //10 la limit so user lay ra
			let users= newContacts.map(async(contact)=>{
			    return await userModel.findUserById(contact.userId);
			});
			resolve(await Promise.all(users));
		}catch(error){
			reject(error);
		}
	});
}

module.exports={
	addNew:addNew,
    findUsersContact:findUsersContact,
    undoAddContact:undoAddContact,
    getContacts:getContacts,
    getContactsSent:getContactsSent,
    getContactsReceived:getContactsReceived,
    countAllContacts:countAllContacts,
    countAllContactsSent:countAllContactsSent,
    countAllContactsReceived:countAllContactsReceived,
    readMoreContact:readMoreContact,
    readMoreContactSent:readMoreContactSent,
    readMoreContactReceived:readMoreContactReceived
}