function videoChat(divId){
	$('#video-chat-'+divId).unbind("click").on("click",function(){
		let targetId= $(this).data("chat");
		let callerName=$('#navbar-username').text();
		let dataToEmit={
			listenerId:targetId,
			callerName:callerName
		}
		// đầu tiên check xem nguoi nhận hiện co dang online??
	    socket.emit("caller-check-listener-online",dataToEmit);
	});

	
}

$(document).ready(function(){
	//caller lắng nghe sự kiện listener không online,trả thông báo cho caller
	socket.on("server-send-listener-is-offline",function(){
		alertify.notify("Người dùng này hiện không trực tuyến","error",7);
	});

    // Tạo 1 peerid từ thư viện peer
	let getPeerId="";
	const peer= new Peer();
	peer.on("open",function(peerId){
		getPeerId=peerId;
	});
	//listener lang nghe su kien tu server,lấy peerid rồi gửi lên server
	socket.on("server-request-get-peerid-from-listener",function(data){
		let listenerName=$('#navbar-username').text();
		let dataToEmit={
			callerId:data.callerId,
			listenerId:data.listenerId,
			callerName:data.callerName,
			listenerName:listenerName,
			listenerPeerId:getPeerId
		}
		socket.emit("listener-emit-peerid-to-server",dataToEmit);
	});
    
    //caller nhận được peerid của listener,xác nhận bắt đầu kết nối
	socket.on("server-send-listener-peerid-to-caller",function(data){
		let dataToEmit={
		callerId:data.callerId,
		listenerId:data.listenerId,
		callerName:data.callerName,
		listenerName:data.listenerName,
		listenerPeerId:data.listenerPeerId
	    }
        //caller gửi yêu cầu gọi đến server
	    socket.emit("caller-request-call-to-server",dataToEmit);
	     //bật modal thông báo đang kết nối phía caller
	     let timerInterval;
	     Swal.fire({
	     	title:'Đang gọi tới <span style="color:#2ECC71;"> '+data.listenerName +' </span><i class="fa fa-volume-control-phone"></i>',
	     	html: 'Time left:<strong></strong><br/><br/><button id="btn-cancel-call" class="btn btn-danger">Hủy cuộc gọi</button>',
	     	timer:30000,
	     	allowOutsideClick:false,
	     	onBeforeOpen:()=>{
	     		$('#btn-cancel-call').unbind("click").on("click",function(){
	     			Swal.close();
	     			clearInterval(timerInterval);
                    //caller gửi sự kiện muốn hủy kết nối
	     			socket.emit("caller-cancel-call",dataToEmit);
	     		});
	     		Swal.showLoading();
	     		timerInterval=setInterval(()=>{
	     			Swal.getContent().querySelector("strong").textContent=Math.ceil(Swal.getTimerLeft()/1000);
	     		},1000);
	     	},
	     	onOpen:()=>{
	     		socket.on("server-send-listener-reject-call",function(data){
	     			Swal.close();
	     			clearInterval(timerInterval);

	     			Swal.fire({
	     				type:"info",
	     				title:'<span style="color:#2ECC71;"> '+data.listenerName +' </span> hiện tại không thể nghe máy',
	     				allowOutsideClick:false,
	     				confirmButtonColor:"#2ECC71",
	     				confirmButtonText:"Xác nhận"
	     			});
	     		});
	     		socket.on("server-send-listener-accept-call",function(data){
	     			Swal.close();
	     			clearInterval(timerInterval);
	     			console.log("listener accepted you");
	     		})
	     	},
	     	onClose:()=>{
	     		clearInterval(timerInterval);
	     	}
	     }).then((result)=>{
	     	return false;
	     })
	});

	socket.on("server-send-request-call-to-listener",function(data){
		let dataToEmit={
		callerId:data.callerId,
		listenerId:data.listenerId,
		callerName:data.callerName,
		listenerName:data.listenerName,
		listenerPeerId:data.listenerPeerId
	    }
	 
	     let timerInterval;
	     Swal.fire({
	     	title:'<span style="color:#2ECC71;"> '+data.callerName +' muốn trò chuyện video với bạn </span><i class="fa fa-volume-control-phone"></i>',
	     	html: 'Time left:<strong></strong><br/><br/><button id="btn-reject-call" class="btn btn-danger">Từ chối cuộc gọi</button><button id="btn-accept-call" class="btn btn-success">Chấp nhận</button>',
	     	timer:30000,
	     	allowOutsideClick:false,
	     	onBeforeOpen:()=>{  
	     		$('#btn-reject-call').unbind("click").on("click",function(){
	     			Swal.close();
	     			clearInterval(timerInterval);
	     			//bắt sự kiện nếu listener từ chối cuộc gọi,gửi lên server
	     			socket.emit("listener-reject-call",dataToEmit);
	     		});
	     		$('#btn-accept-call').unbind("click").on("click",function(){
	     			Swal.close();
	     			clearInterval(timerInterval);
	     			//bắt sự kiện nếu listener chấp nhận cuộc gọi,gửi lên server
	     			socket.emit("listener-accept-call",dataToEmit);
	     		});
	     		Swal.showLoading();
	     		timerInterval=setInterval(()=>{
	     			Swal.getContent().querySelector("strong").textContent=Math.ceil(Swal.getTimerLeft()/1000);
	     		},1000);
	     	},
	     	onOpen:()=>{
	     		socket.on("server-send-caller-cancel-call",function(data){
	     			Swal.close();
	     			clearInterval(timerInterval);
	     		});
	     	},
	     	onClose:()=>{
	     		clearInterval(timerInterval);
	     	}
	     }).then((result)=>{
	     	return false;
	     })
	});	
});