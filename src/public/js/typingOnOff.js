function typingOn(divId){
	let targetId=$("#write-chat-"+divId).data("chat");
	if($("#write-chat-"+divId).hasClass("chat-in-group")){
		socket.emit("user-is-typing",{groupId:targetId})
	}else{
		socket.emit("user-is-typing",{contactId:targetId})
	}
}

function typingOff(divId){
	let targetId=$("#write-chat-"+divId).data("chat");
	if($("#write-chat-"+divId).hasClass("chat-in-group")){
		socket.emit("user-is-not-typing",{groupId:targetId})
	}else{
		socket.emit("user-is-not-typing",{contactId:targetId})
	}
}

$(document).ready(function(){
	// Lắng nghe sự kiện typing on
	socket.on("response-user-is-typing",function(data){
		let messageTyping= '<div class="bubble you bubble-typing-gif"><img src="/images/chat/typing.gif"/></div>';
		if(data.currentGroupId){  //neu la nhom tro chuyen

		}else{ //neu la cuoc tro chuyen ca nhan
			let check=$('.chat[data-chat='+data.currentUserId+']').find("div.bubble-typing-gif");
			if(check.length){
				return false;
			}
			$('.chat[data-chat='+data.currentUserId+']').append(messageTyping);
			nineScrollRight(data.currentUserId);
		}
	});

	//lắng nghe sự kiện typing off
	socket.on("response-user-is-not-typing",function(data){
		if(data.currentGroupId){  //neu la nhom tro chuyen

		}else{ //neu la cuoc tro chuyen ca nhan
			$('.chat[data-chat='+data.currentUserId+']').find("div.bubble-typing-gif").remove();
			nineScrollRight(data.currentUserId);
		}
	});
})