import addNewContact from "./contact/addNewContact";
import undoAddContact from "./contact/undoAddContact";
import deleteAddFriendRequest from "./contact/deleteAddFriendRequest";
import acceptAddFriendRequest from "./contact/acceptAddFriendRequest";
import unfriend from "./contact/unfriend";
import textWithEmoji from "./chat/textWithEmoji";
import typingOn from "./chat/typingOn";
import typingOff from "./chat/typingOff";
 
let initSocket =(io)=>{
	addNewContact(io);
	undoAddContact(io);
	deleteAddFriendRequest(io);
	acceptAddFriendRequest(io);
	unfriend(io);
	textWithEmoji(io);
	typingOn(io);
	typingOff(io);
}

module.exports =initSocket;