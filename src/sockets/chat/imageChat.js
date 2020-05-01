import {pushSocketIdToArray,removeSocketIdFromArray} from "./../../helpers/socketHelper";
let imageChat=(io)=>{
	let client={};
	io.on("connection",(socket)=>{  // lang nghe su kien connection khi user mo 1 tab mo
		//put socketid to user array
		client=pushSocketIdToArray(client,socket.request.user._id,socket.id);
		socket.on("send-image",(data)=>{  //lang nghe su kien add-new-contact tu user
			if(data.groupId){ //neu tin nhan tu group
				let response={
					currentGroupId:data.groupId,
					currentUserId:socket.request.user._id,
					message:data.message,
				}
				//emit message
				if(client[data.groupId]){
					client[data.groupId].forEach(socketId=>{
						io.sockets.connected[socketId].emit("response-send-image",response); //gui ve su kien response-add-new-contact cho client
					})
				}
			}
			if(data.contactId){ //neu la tin nhan 
				let response={
					currentUserId:socket.request.user._id,
					message:data.message
				}			
				//emit message
				if(client[data.contactId]){
					client[data.contactId].forEach(socketId=>{
						io.sockets.connected[socketId].emit("response-send-image",response); //gui ve su kien response-add-new-contact cho client
					})
				}	
			}

		}); 
        //remove socket.id khi client dong tab hoac thoat ung dung
		socket.on("disconnect",()=>{ 
			client =removeSocketIdFromArray(client,socket.request.user._id,socket.id);
		})
	});
}

module.exports=imageChat;


 