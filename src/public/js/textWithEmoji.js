function textWithEmoji(divId){
	$(".emojionearea").unbind("keyup").on("keyup",function(element){
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
			$.post("/message/add-new-text-emoji",dataTextForSend,function(data){
				console.log(data.message);
			}).fail(function(response){
				console.log(response);
			});
		}
	});
}