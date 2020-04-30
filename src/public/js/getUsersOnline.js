socket.on("server-send-users-online",function(data){
	data.forEach((item)=>{
		$('.person[data-chat='+item+']').find("div.dot").addClass("online");
		$('.person[data-chat='+item+']').find("img").addClass("avatar-online");
	})
});

socket.on("server-send-when-new-user-online",function(data){
	$('.person[data-chat='+data+']').find("div.dot").addClass("online");
	$('.person[data-chat='+data+']').find("img").addClass("avatar-online");
});

socket.on("server-send-when-new-user-offline",function(data){
	$('.person[data-chat='+data+']').find("div.dot").removeClass("online");
	$('.person[data-chat='+data+']').find("img").removeClass("avatar-online");
});