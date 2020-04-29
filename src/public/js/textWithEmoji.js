function textWithEmoji(divId){
	$(".emojionearea").unbind("keyup").on("keyup",function(element){
		let currentEmojioneArea=$(this); // lấy DOM hiện tại của khung chat
		//nếu người dùng gõ phím "Enter"
		if(element.which===13){
			let targetId=$("#write-chat-"+divId).data("chat");
			let targetVal=$("#write-chat-"+divId).val();
			if(!targetId.length || !targetVal){
				return false;
			}
			let dataTextForSend={
				uid:targetId,
				messageVal:targetVal
			}
			if($("#write-chat-"+divId).hasClass("chat-in-group")){
				dataTextForSend.isChatGroup=true;
			} 
			//gửi nội dung chat lên server
			$.post("/message/add-new-text-emoji",dataTextForSend,function(data){
				// let messageOfMe= $('<div class="bubble me data-mess-id="'+data.message._id+'"</div>');
				// messageOfMe.html('<img src="/images/users/'+data.message.sender.avatar+'" class="avatar-small" title="'+data.message.sender.name+'">');
				//messageOfMe.text(data.message.text);

                
				divMessage=$('<div class="convert-emoji bubble me" data-mess-id="'+data.message._id+'"><img src="/images/users/'+data.message.sender.avatar+'" class="avatar-small" title="'+data.message.sender.name+'">'+data.message.text+'</div>');
				//nếu là group chat thì tăng biến đếm lên 1
                if (dataTextForSend.isChatGroup) {
					increaseNumberMessageGroup(divId);
				}
				let convertEmoji=emojione.toImage(divMessage.html());
				divMessage.html(convertEmoji);

				$('.right .chat[data-chat='+divId+']').append(divMessage);
				nineScrollRight(divId);
                // xóa tin nhắn đã gửi ở khung nhập văn bản
				$("#write-chat-"+divId).val(" ");
				currentEmojioneArea.find('.emojionearea-editor').text(" ");

				//change preview message in leftside
				$('.person[data-chat='+divId+']').find("span.time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
				$('.person[data-chat='+divId+']').find("span.preview").html(emojione.toImage(data.message.text));

				//move conversation to Top
			    $('.person[data-chat='+divId+']').on("click.moveConversationToTheTop",function(){
			    	let dataToMove= $(this).parent();
			    	$(this).closest("ul").prepend(dataToMove);
			    	$(this).off("click.moveConversationToTheTop"); //huy ngay su kien click
			    });
			    $('.person[data-chat='+divId+']').click();

			    //Emit socket lên server

			}).fail(function(response){
				console.log(response);
			});
		}
	});
}