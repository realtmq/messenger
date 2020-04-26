import messageModel from "./../models/messageModel";
import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import chatGroupModel from "./../models/chatGroupModel";
import _ from "lodash";
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
		    	let getMessages = await messageModel.model.getMessages(currentUserId,conversation._id,30);//lay ra 30 tin nhan gan nhat
		    	conversation=conversation.toObject();
		    	conversation.messages=getMessages;
		    	return conversation;
		    });
		    let getAllConversationWithMessages = await Promise.all(getAllConversationWithMessagesPromise);
		    
		    getAllConversationWithMessages= _.sortBy(getAllConversationWithMessages,(item)=>{
		    	return -item.updatedAt;
		    });
		    resolve({
		    	userConversations:userConversations,
		    	groupConversations:groupConversations,
		    	allConversations:allConversations,
		    	getAllConversationWithMessages:getAllConversationWithMessages
		    });
		}catch(error){
			reject(error);
		}
	})

}

module.exports ={
	getAllConversationItems:getAllConversationItems
}