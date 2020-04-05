import {pushSocketIdToArray,removeSocketIdFromArray} from "./../../helpers/socketHelper";
let addNewContact=(io)=>{
	let client={};
	io.on("connection",(socket)=>{  // lang nghe su kien connection khi user mo 1 tab moi
		
		//put socketid to user array
		let currentUserId=socket.request.user._id;
		client=pushSocketIdToArray(client,currentUserId,socket.id);

		socket.on("add-new-contact",(data)=>{  //lang nghe su kien add-new-contact tu user
			let currentUser={
				id:socket.request.user._id,
				username:socket.request.user.username,
				avatar:socket.request.user.avatar,
				address:(socket.request.user.address ==! null)?socket.request.user.address:" "
			}

			//emit notification
			if(client[data.contactId]){
				client[data.contactId].forEach(socketId=>{
					io.sockets.connected[socketId].emit("response-add-new-contact",currentUser); //gui ve su kien response-add-new-contact cho client
				})
			}
			
		}); 

        //remove socket.id khi client dong tab hoac thoat ung dung
		socket.on("disconnect",()=>{ 
			client =removeSocketIdFromArray(client,currentUserId,socket.id);
		})
	});
}

module.exports=addNewContact;
 