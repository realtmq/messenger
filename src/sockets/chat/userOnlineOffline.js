import {pushSocketIdToArray,removeSocketIdFromArray} from "./../../helpers/socketHelper";
let userOnlineOffline=(io)=>{
	let client={};
	io.on("connection",(socket)=>{  // lang nghe su kien connection khi user mo 1 tab mo
		//put socketid to user array
		client=pushSocketIdToArray(client,socket.request.user._id,socket.id); 
		let usersOnline=Object.keys(client);
		socket.emit("server-send-users-online",usersOnline);
		//when have new user online
		socket.broadcast.emit("server-send-when-new-user-online",socket.request.user._id);
        //remove socket.id khi client dong tab hoac thoat ung dung
		socket.on("disconnect",()=>{ 
			
			socket.broadcast.emit("server-send-when-new-user-offline",socket.request.user._id);
			client =removeSocketIdFromArray(client,socket.request.user._id,socket.id);
		})
	});
}

module.exports=userOnlineOffline;
 