import addNewContact from "./contact/addNewContact";

let initSocket =(io)=>{
	addNewContact(io);
}

module.exports =initSocket;