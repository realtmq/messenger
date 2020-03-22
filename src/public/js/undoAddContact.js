function undoAddContact(){
	$(".user-remove-request-contact").bind("click",function(){
		let targetId= $(this).data("uid");
		$.ajax({
			url:"contact/undo-add-contact",
			type:"delete",
			data:{uid:targetId},
			success:function(data){
				if(data.success){
				$("#find-user").find('div.user-add-new-contact[data-uid='+targetId+']').css("display","inline-block");
				$("#find-user").find('div.user-remove-request-contact[data-uid='+targetId+']').hide();
	            decreaseNotiContact("count-request-contact-sent");
		     	//socketio bai sau
			}
			}
		});
	});
}