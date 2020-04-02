import addNewContact from "./contact/addNewContact";
import undoAddContact from "./contact/undoAddContact";


let initSocket =(io)=>{
	addNewContact(io);
	undoAddContact(io);
}

module.exports =initSocket;