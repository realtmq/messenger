import {pushSocketIdToArray,removeSocketIdFromArray} from "./../../helpers/socketHelper";
let videoChat=(io)=>{
	let client={};
	io.on("connection",(socket)=>{  // lang nghe su kien connection khi user mo 1 tab mới hoặc đăng nhập
		//put socketid to user array
		client=pushSocketIdToArray(client,socket.request.user._id,socket.id);
		socket.on("caller-check-listener-online",(data)=>{ //lắng nghe sự kiện check listener có online hay không
			//nếu listener đang online
			if(client[data.listenerId]){
				let response={
					callerId:socket.request.user._id,
					listenerId:data.listenerId,
					callerName:data.callerName
				}
				//server gui ve yeu cau lay peerId cua listener
				client[data.listenerId].forEach(socketId=>{
					io.sockets.connected[socketId].emit("server-request-get-peerid-from-listener",response);
				})

		    //neu listener khong online
			}else{
				socket.emit("server-send-listener-is-offline");
			}
		}); 

		//lang nghe su kien gui peer Id tu listener,lấy peerId của listener gửi cho caller
		socket.on("listener-emit-peerid-to-server",(data)=>{
		    let response={
			callerId:data.callerId,
			listenerId:data.listenerId,
			callerName:data.callerName,
			listenerName:data.listenerName,
			listenerPeerId:data.listenerPeerId
		    }
		    if(client[data.callerId]){
				client[data.callerId].forEach(socketId=>{
					io.sockets.connected[socketId].emit("server-send-listener-peerid-to-caller",response);
				})
			}
        })
        //server gui ve cho listener khi caller goi
        socket.on("caller-request-call-to-server",(data)=>{
        	let response={
			callerId:data.callerId,
			listenerId:data.listenerId,
			callerName:data.callerName,
			listenerName:data.listenerName,
			listenerPeerId:data.listenerPeerId
		    }
		    if(client[data.listenerId]){
				client[data.listenerId].forEach(socketId=>{
					io.sockets.connected[socketId].emit("server-send-request-call-to-listener",response);
				})
			}
        })
        //server gui ve cho listener khi caller huy cuoc goi
        socket.on("caller-cancel-call",(data)=>{
        	let response={
			callerId:data.callerId,
			listenerId:data.listenerId,
			callerName:data.callerName,
			listenerName:data.listenerName,
			listenerPeerId:data.listenerPeerId
		    }
		    if(client[data.listenerId]){
				client[data.listenerId].forEach(socketId=>{
					io.sockets.connected[socketId].emit("server-send-caller-cancel-call",response);
				})
			}
        });
        //lắng nghe sự kiện nếu listener từ chối cuộc gọi,gửi thông báo cho caller
        socket.on("listener-reject-call",(data)=>{
        	let response={
			callerId:data.callerId,
			listenerId:data.listenerId,
			callerName:data.callerName,
			listenerName:data.listenerName,
			listenerPeerId:data.listenerPeerId
		    }
		    if(client[data.callerId]){
				client[data.callerId].forEach(socketId=>{
					io.sockets.connected[socketId].emit("server-send-listener-reject-call",response);
				})
			}
        });
        //lắng nghe sự kiện nếu listener chấp nhận cuộc gọi,gửi về cho caller
        socket.on("listener-accept-call",(data)=>{
        	let response={
			callerId:data.callerId,
			listenerId:data.listenerId,
			callerName:data.callerName,
			listenerName:data.listenerName,
			listenerPeerId:data.listenerPeerId
		    }
		    if(client[data.callerId]){
				client[data.callerId].forEach(socketId=>{
					io.sockets.connected[socketId].emit("server-send-listener-accept-call",response);
				})
			}
        });

        //remove socket.id khi client dong tab hoac thoat ung dung
		socket.on("disconnect",()=>{ 
			client =removeSocketIdFromArray(client,socket.request.user._id,socket.id);
		})
	});
}

module.exports=videoChat;


 