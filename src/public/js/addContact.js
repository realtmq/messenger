function addContact(){
	$(".user-add-new-contact").bind("click",function(){
		let targetId= $(this).data("uid");
		$.post("/contact/add-new",{uid: targetId},function(data){
			if(data.success){
				$("#find-user").find('div.user-add-new-contact[data-uid='+targetId+']').hide();
				$("#find-user").find('div.user-remove-request-contact[data-uid='+targetId+']').css("display","inline-block");
				increaseNotiContact("count-request-contact-sent");
				//realtime socket
				socket.emit("add-new-contact",{contactId:targetId});
			}
		});
		
	});
}

socket.on("response-add-new-contact",function(user){
	let noti= '<div class="notification-unread" data-uid="'+user.id+'"><img class="avatar-small" src="images/users/'+user.avatar+'" alt="">  <strong>'+user.username+'</strong> đã gửi cho bạn một lời mời kết bạn!</div>';

    $(".noti_content").prepend(noti);//them thong bao tai popup
    $("ul.list-notifications").prepend('<li>'+noti+'</li>'); //them thong bao tai modal
    increaseNotiContact("count-request-contact-received");
    increaseNotiNavbar("noti_contact_counter",1);
    increaseNotiNavbar("noti_counter",1);
})


// <span data-uid="${ user.id }">
// <img class="avatar-small" src="images/users/default-avatar-trungquandev-02.jpg" alt=""> 
// <strong>Trung Quân</strong> đã gửi cho bạn một lời mời kết bạn!
// </span><br><br><br>


	   
       
           