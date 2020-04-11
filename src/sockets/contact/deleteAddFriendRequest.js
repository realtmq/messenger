import {pushSocketIdToArray,removeSocketIdFromArray} from "./../../helpers/socketHelper";
let deleteAddFriendRequest=(io)=>{
	let client={}; 
	io.on("connection",(socket)=>{  // lắng nghe sự kiên khi user mở 1 tab mới
		//put socketid to user array
		let currentUserId=socket.request.user._id; // lấy tất cả các socket kết nối với server(socket của sự kiện "connection")
		pushSocketIdToArray(client,currentUserId,socket.id) //tạo 1 mảng các socket.id của 1 user 	
		//client[userId]=[socketId1,socketId2...]; 

		socket.on("delete-add-friend-request",(data)=>{ //bắt sự kiện "delete-addfriendrequest",kèm id người gửi lời mời kết bạn
			let currentUser={
		 		id:socket.request.user._id  //lấy id của người nhận lời mời kết bạn(là socket gửi sự kiện delete-add-friend-request)
			}
			if(client[data.contactId]){
				client[data.contactId].forEach(socketId=>{ //lấy tất cả socket id của người gửi lời mời kết bạn  
					io.sockets.connected[socketId].emit("response-delete-add-friend-request",currentUser);//gửi về id của người nhận lời mời kết bạn
				})
			}
			
		}); 

        //remove socket.id khi client dong tab hoac thoat ung dung
		socket.on("disconnect",()=>{
			removeSocketIdFromArray(client,currentUserId,socket.id); //loại bỏ socketId khỏi mảng khi 1 user ngắt kết nối
		});
	});
}
 
module.exports=deleteAddFriendRequest