import messageModel from "./../models/messageModel";
import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import chatGroupModel from "./../models/chatGroupModel";
import {transErrors} from "./../../lang/vi";
import {app} from "./../config/app";
import _ from "lodash";
import fsExtra from "fs-extra";
let getAllConversationItems=(currentUserId)=>{
	return new Promise(async (resolve,reject)=>{
		try{
			let contacts=await contactModel.getContacts(currentUserId,15); //lay id 10 contact 
		    let userConversationsPromise= contacts.map(async (contact)=>{
			    if(currentUserId == contact.contactId){
					let getUserContact = await userModel.findUserById(contact.userId);
					getUserContact.updatedAt= contact.updatedAt;
					return getUserContact;
				}else{
				    let getUserContact= await userModel.findUserById(contact.contactId);
				    getUserContact.updatedAt=contact.updatedAt;
				    return getUserContact;
				    }
		        });	
		    let userConversations = await Promise.all(userConversationsPromise);
		    let groupConversations= await chatGroupModel.getChatGroups(currentUserId,10); //LAY 10  GROUP 
		    let allConversations= userConversations.concat(groupConversations);	
		    allConversations = _.sortBy(allConversations,(item)=>{
		    	return -item.updatedAt;
		    });	

		    //lay tin nhan cua moi cuoc tro chuyen
		    let getAllConversationWithMessagesPromise = allConversations.map(async(conversation)=>{
		    	conversation=conversation.toObject();
		    	if(conversation.members){
		    		let getMessages = await messageModel.model.getMessagesInGroup(conversation._id,30);//lay ra 30 tin nhan gan nhat
		    	    conversation.messages=  _.reverse(getMessages); 
		    	}else{
		    	    let getMessages = await messageModel.model.getMessagesPersonal(currentUserId,conversation._id,30);//lay ra 30 tin nhan gan nhat
		    	    conversation.messages=_.reverse(getMessages);
		        }
		    	return conversation;  
		    });
		    let getAllConversationWithMessages = await Promise.all(getAllConversationWithMessagesPromise);
		    
		    getAllConversationWithMessages= _.sortBy(getAllConversationWithMessages,(item)=>{
		    	return -item.updatedAt;
		    });
		    resolve({
		    	getAllConversationWithMessages:getAllConversationWithMessages
		    });
		}catch(error){
			reject(error);
		}
	})

}

let addNewTextEmoji=(sender,receiverId,messageVal,isChatGroup)=>{
	return new Promise(async(resolve,reject)=>{
		try{
		if(isChatGroup){
			let chatGroupReceiver= await chatGroupModel.getChatGroupById(receiverId);
			if(!chatGroupReceiver){
				return reject(transErrors.group_chat_not_found);
			}else{
				let receiver={
					id:chatGroupReceiver._id,
					name:chatGroupReceiver.name,
					avatar:app.general_avatar_group_chat
				}
				let newMessageItem={
					senderId:sender.id,
					receiverId:receiver.id,
					conversationType:messageModel.conversationTypes.GROUP,
					messageType:messageModel.messageTypes.TEXT,
					sender:sender,
					receiver:receiver,
					text:messageVal,
					createdAt:Date.now()
				}
				let newMessage= await messageModel.model.createNew(newMessageItem);
				await chatGroupModel.updateWhenHasNewMessage(chatGroupReceiver._id,(chatGroupReceiver.messageAmount+1));
				resolve(newMessage);
			}
		}else{
			let userReceiver= await userModel.findUserById(receiverId);
			if(!userReceiver){
				return reject(transErrors.group_chat_not_found); 
			}
			let receiver={
				id:userReceiver._id,
				name:userReceiver.username,
				avatar:userReceiver.avatar
			}
			let newMessageItem={
					senderId:sender.id,
					receiverId:receiver.id,
					conversationType:messageModel.conversationTypes.PERSONAL,
					messageType:messageModel.messageTypes.TEXT,
					sender:sender,
					receiver:receiver,
					text:messageVal,
					createdAt:Date.now()
				}
			let newMessage= await messageModel.model.createNew(newMessageItem);
			await contactModel.updateWhenHasNewMessage(sender.id,userReceiver._id);
			resolve(newMessage);
		}
	}catch(error){
		reject(error);
	}
	});
}

let sendMessageImage=(sender,receiverId,messageVal,isChatGroup)=>{
	return new Promise(async(resolve,reject)=>{
		try{
		if(isChatGroup){
			let chatGroupReceiver= await chatGroupModel.getChatGroupById(receiverId);
			if(!chatGroupReceiver){
				return reject(transErrors.group_chat_not_found);
			}else{
				let receiver={
					id:chatGroupReceiver._id,
					name:chatGroupReceiver.name,
					avatar:app.general_avatar_group_chat
				}
				let imageBuffer= await fsExtra.readFile(messageVal.path);
				let imageContentType= messageVal.mimetype;
				let imageName= messageVal.originalname;

				let newMessageItem={
					senderId:sender.id,
					receiverId:receiver.id,
					conversationType:messageModel.conversationTypes.GROUP,
					messageType:messageModel.messageTypes.IMAGE,
					sender:sender,
					receiver:receiver,
					file:{data:imageBuffer,contentType:imageContentType,fileName:imageName},
					createdAt:Date.now()
				}
				let newMessage= await messageModel.model.createNew(newMessageItem);
				await chatGroupModel.updateWhenHasNewMessage(chatGroupReceiver._id,(chatGroupReceiver.messageAmount+1));
				resolve(newMessage);
			}
		}else{
			let userReceiver= await userModel.findUserById(receiverId);
			if(!userReceiver){
				return reject(transErrors.group_chat_not_found); 
			}
			let receiver={
				id:userReceiver._id,
				name:userReceiver.username,
				avatar:userReceiver.avatar
			}
			let imageBuffer= await fsExtra.readFile(messageVal.path);
			let imageContentType= messageVal.mimetype;
			let imageName= messageVal.originalname;
			let newMessageItem={
					senderId:sender.id,
					receiverId:receiver.id,
					conversationType:messageModel.conversationTypes.PERSONAL,
					messageType:messageModel.messageTypes.IMAGE,
					sender:sender,
					receiver:receiver,
					file:{data:imageBuffer,contentType:imageContentType,fileName:imageName},
					createdAt:Date.now()
				}
			let newMessage= await messageModel.model.createNew(newMessageItem);
			await contactModel.updateWhenHasNewMessage(sender.id,userReceiver._id);
			resolve(newMessage);
		}
	}catch(error){
		reject(error);
	}
	});
}

module.exports ={
	addNewTextEmoji:addNewTextEmoji,
	getAllConversationItems:getAllConversationItems,
	sendMessageImage:sendMessageImage
}