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

//tream video
function playVideoStream(videoTagId,stream){
	let video=document.getElementById(videoTagId);
	video.srcObject= stream;
	video.onloadeddata= function(){
		video.play();
	};
}

//close video stream
function closeVideoStream(stream){
	return stream.getTracks().forEach(track=>track.stop());
}

$(document).ready(function(){
	//caller lắng nghe sự kiện listener không online,trả thông báo cho caller
	socket.on("server-send-listener-is-offline",function(){
		alertify.notify("Người dùng này hiện không trực tuyến","error",7);
	});

    // Tạo 1 peerid từ thư viện peer,caasu,cau hinh peer
	let getPeerId="";
	const peer= new Peer({
		key:"peerjs",
		host:"peerjs-server-trungquandev.herokuapp.com",
		secure:true,
		port:443,
		debug:3
	});

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
    
    let timerInterval;
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
	     Swal.fire({
	     	title:'Đang gọi tới <span style="color:#2ECC71;"> '+data.listenerName +' </span><i class="fa fa-volume-control-phone"></i>',
	     	html: 'Time left :<strong></strong><br/><br/><button id="btn-cancel-call" class="btn btn-danger">Hủy cuộc gọi</button>',
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
	 
	     Swal.fire({
	     	title:'<span style="color:#2ECC71;"> '+data.callerName +' muốn trò chuyện video với bạn </span><i class="fa fa-volume-control-phone"></i>',
	     	html: 'Time left :<strong></strong><br/><br/><button id="btn-reject-call" class="btn btn-danger">Từ chối cuộc gọi</button><button id="btn-accept-call" class="btn btn-success">Chấp nhận</button>',
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

	socket.on("server-send-listener-accept-to-caller",function(data){
		Swal.close();
		clearInterval(timerInterval);

		let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
		getUserMedia({video: true, audio: true}, function(stream) {
			//show modal streaming
			$("#streamModal").modal("show");
			//play stream of caller in modal
			playVideoStream("local-stream",stream);
			//call to listener
			let call = peer.call(data.listenerPeerId, stream);

			call.on("stream", function(stream) {
				//play stream of listener in modal
			    playVideoStream("remote-stream",stream);
		    });
		    $("#streamModal").on("hidden.bs.modal",function(){
		    	closeVideoStream(stream);
		    });
}, function(err) {
  console.log("Failed to get local stream" ,err);
});

	})

	socket.on("server-send-caller-accept-to-listener",function(data){
		Swal.close();
		clearInterval(timerInterval);
		let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
	    

	    peer.on('call', function(call) {
	    getUserMedia({video: true, audio: true}, function(stream) {
	    	//show modal streaming
		    $("#streamModal").modal("show");
		    //play stream of of listener in modal
		    playVideoStream("local-stream",stream);
	        call.answer(stream); // Answer the call with an A/V stream.
	        call.on('stream', function(stream) {
	        //play stream of caller in modal
			    playVideoStream("remote-stream",stream);
	        });
	        $("#streamModal").on("hidden.bs.modal",function(){
		    	closeVideoStream(stream);
		    })
	     }, function(err) {
	    console.log('Failed to get local stream' ,err);
	  });
});
	})


});