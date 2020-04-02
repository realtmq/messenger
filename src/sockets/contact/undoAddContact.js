import {pushSocketIdToArray,removeSocketIdFromArray} from "./../../helpers/socketHelper";
let undoAddContact=(io)=>{
	let client={};
	io.on("connection",(socket)=>{  // lang nghe su kien connection khi user mo 1 tab moi
		//put socketid to user array
		let currentUserId=socket.request.user._id;
		pushSocketIdToArray(client,currentUserId,socket.id)

		socket.on("undo-add-contact",(data)=>{  //lang nghe su kien add-new-contact tu user
			let currentUser={
				id:socket.request.user._id
			}
			//emit ve cho user
			if(client[data.contactId]){
				client[data.contactId].forEach(socketId=>{
					io.sockets.connected[socketId].emit("response-undo-add-contact",currentUser); //gui ve su kien response-add-new-contact cho client
				})
			}
			
		}); 

        //remove socket.id khi client dong tab hoac thoat ung dung
		socket.on("disconnect",()=>{
			removeSocketIdFromArray(client,currentUserId,socket.id);
		});
	});
}

module.exports=undoAddContact;
 