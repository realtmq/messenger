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
		     	socket.emit("undo-add-contact",{contactId:targetId});
			}
			}
		});
	});
}

socket.on("response-undo-add-contact",function(user){
	$(".noti_content").find('div[data-uid='+user.id+']').remove(); //xoa thong bao tai popup
	$("ul.list-notifications").find('li>div[data-uid='+user.id+']').parent().remove(); //xoa thong bao tai modal
	//xoa  o modal tab yeu cau kb
    decreaseNotiContact("count-request-contact-received");
    decreaseNotiNavbar("noti_contact_counter",1);
    decreaseNotiNavbar("noti_counter",1);
})