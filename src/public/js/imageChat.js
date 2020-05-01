function bufferToBase64(buffer){
	return btoa(new Uint8Array(buffer).reduce((data,byte)=>data+String.fromCharCode(byte),""));
}

function imageChat(divId){
  $('#image-chat-'+divId).unbind("change").on("change",function(){
  	let isChatGroup=false;
  	let fileData=$(this).prop("files")[0];
		let match=["image/png","image/jpg","image/jpeg"];
		let limit = 1048576; ///1MB

        //VALIDATE AVATAR CLIENT-SIDE
		if($.inArray(fileData.type,match) ===-1)
		{
			alertify.notify("kieu file khong hop le,chi chap nhan jpg,jpeg,png","error",7);
			$(this).val= null;
			return false;
		}
		if(fileData.size>limit)
		{
			alertify.notify("chi chap nhan file anh duoi 1MB","error",7);
 			$(this).val= null;
			return false;
		}
		
		let targetId=$(this).data("chat");

		let messageFormData=new FormData();
		messageFormData.append("my-image-chat",fileData);
		messageFormData.append("uid",targetId);

		if($(this).hasClass("chat-in-group")){
			messageFormData.append("is-chat-group",true);
		} 

		$.ajax({
		url:"/message/send-message-image",
		type:"post",
		cache:false,
		contentType:false,
		processData:false,
		data:messageFormData,
		success: function(data){
			let dataToEmit={
                	message:data.message
                }
                // chuyen dinh dang anh tuw buffer sang base64
                image=bufferToBase64(data.message.file.data.data); //2 lan data vi khi ajax truyen ve data nam trong key data
                //tạo 1 div tin nhắn gửi đi
				divMessage=$('<div class="bubble me bubble-image-file" data-mess-id="'+data.message._id+'"><img src="/images/users/'+data.message.sender.avatar+'" class="avatar-small" title="'+data.message.sender._id+'"><img src="data:'+data.message.file.contentType+'; base64,'+image+'" class="show-image-chat"></div>');
				//nếu là group chat thì tăng biến đếm lên 1
                if (isChatGroup) {
					increaseNumberMessageGroup(divId);
					dataToEmit.groupId= targetId;
				}else{
				dataToEmit.contactId=targetId;
			    }

                //apperd thêm tin nhắn
				$('.right .chat[data-chat='+divId+']').append(divMessage);
				nineScrollRight(divId);
             
				//change preview message in leftside
				$('.person[data-chat='+divId+']').find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
				$('.person[data-chat='+divId+']').find("span.preview").html("Hình ảnh");

				//move conversation to Top
			    $('.person[data-chat='+divId+']').on("click.moveConversationToTheTop",function(){
			    	let dataToMove= $(this).parent();
			    	$(this).closest("ul").prepend(dataToMove);
			    	$(this).off("click.moveConversationToTheTop"); //huy ngay su kien click
			    });
			    $('.person[data-chat='+divId+']').click();

			    //Emit socket lên server
			    socket.emit("send-image",dataToEmit);
			    // 7 remove typing real time
			    typingOff(divId);
			    // 8 remove all typing
			    let check=$('.chat[data-chat='+data.currentUserId+']').find("div.bubble-typing-gif");
			        if(check.length){
			      	    check.remove();
			        }

			     //9 them anh vao modal
			     let imageChatModal=$('<img src="data:'+data.message.file.contentType+'; base64,'+image+'">');
			     $('#imagesModal_'+divId).find("div.all-images").append(imageChatModal);
		},
		error: function(error){
			alertify.notify(error.responseText,"error",7);
		}
	});
  });
}
$(document).ready(function(){
	socket.on("response-send-image",function(data){
		let divId="";
		if(data.currentUserId){
			divId=data.currentUserId;
		}else{
			divId=data.groupId;
			increaseNumberMessageGroup(divId);
		}
		// chuyen dinh dang anh tuw buffer sang base64
        image=bufferToBase64(data.message.file.data.data); //2 lan data vi khi ajax truyen ve data nam trong key data
        //tạo 1 div tin nhắn gửi đi
		divMessage=$('<div class="bubble you bubble-image-file" data-mess-id="'+data.message._id+'"><img src="/images/users/'+data.message.sender.avatar+'" class="avatar-small" title="'+data.message.sender._id+'"><img src="data:'+data.message.file.contentType+'; base64,'+image+'" class="show-image-chat"></div>');
        //append thêm tin nhắn
		$('.right .chat[data-chat='+divId+']').append(divMessage);
		nineScrollRight(divId);
     
		//change preview message in leftside
		$('.person[data-chat='+divId+']').find("span.time").addClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
		$('.person[data-chat='+divId+']').find("span.preview").html("Hình ảnh");

		//move conversation to Top
	    $('.person[data-chat='+divId+']').on("click.moveConversationToTheTop",function(){
	    	let dataToMove= $(this).parent();
	    	$(this).closest("ul").prepend(dataToMove);
	    	$(this).off("click.moveConversationToTheTop"); //huy ngay su kien click
	    });
	    $('.person[data-chat='+divId+']').click();

	     //9 them anh vao modal
	     let imageChatModal=$('<img src="data:'+data.message.file.contentType+'; base64,'+image+'">');
	     $('#imagesModal_'+divId).find("div.all-images").append(imageChatModal);
	})
})