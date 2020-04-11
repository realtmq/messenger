import addNewContact from "./contact/addNewContact";
import undoAddContact from "./contact/undoAddContact";
import deleteAddFriendRequest from "./contact/deleteAddFriendRequest";
 
let initSocket =(io)=>{
	addNewContact(io);
	undoAddContact(io);
	deleteAddFriendRequest(io);
}

module.exports =initSocket;