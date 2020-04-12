import addNewContact from "./contact/addNewContact";
import undoAddContact from "./contact/undoAddContact";
import deleteAddFriendRequest from "./contact/deleteAddFriendRequest";
import acceptAddFriendRequest from "./contact/acceptAddFriendRequest";
import unfriend from "./contact/unfriend";
 
let initSocket =(io)=>{
	addNewContact(io);
	undoAddContact(io);
	deleteAddFriendRequest(io);
	acceptAddFriendRequest(io);
	unfriend(io);
}

module.exports =initSocket;