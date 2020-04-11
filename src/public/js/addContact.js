function addContact(){
	$(".user-add-new-contact").bind("click",function(){
		let targetId= $(this).data("uid");
		$.post("/contact/add-new",{uid: targetId},function(data){
			if(data.success){
				$("#find-user").find('div.user-add-new-contact[data-uid='+targetId+']').hide();
				$("#find-user").find('div.user-remove-request-contact[data-uid='+targetId+']').css("display","inline-block");
				increaseNotiContact("count-request-contact-sent");
                increaseNotiNavbar("noti_contact_counter",1);
				//lay the 'li'	cua modal finduser chuyen sang tab dang cho xac nhan			
				let userInfoHtml=$("#find-user").find('ul li[data-uid='+targetId+']').get(0).outerHTML;
				$("#request-contact-sent").find("ul").prepend(userInfoHtml);
                undoAddContact(); //  js/undoAddContact  
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

//them o modal dang yeu cau xac nhan
    let userInfoHtml='<li class="_contactList" data-uid="'+user.id+'">'+
                                        '<div class="contactPanel">'+
                                            '<div class="user-avatar">'+
                                             '   <img src="images/users/'+user.avatar+'" alt="">'+
                                            '</div>'+
                                            '<div class="user-name">'+
                                                '<p>'+
                                                    user.username+
                                                '</p>'+
                                            '</div>'+
                                            '<br>'+
                                            '<div class="user-address">'+
                                                '<span>&nbsp '+user.address+'</span>'+
                                            '</div>'+
                                            '<div class="user-acccept-contact-received" data-uid="'+user.id+'">'+
                                                'Chấp nhận'+
                                            '</div>'+
                                            '<div class="delete-add-friend-request action-danger" data-uid="'+user.id+'">'+
                                                'Xóa yêu cầu'+
                                            '</div>'+
                                        '</div>'+
                                    '</li>';

    $("#request-contact-received").find("ul").prepend(userInfoHtml);
    deleteAddFriendRequest();
})


// <span data-uid="${ user.id }">
// <img class="avatar-small" src="images/users/default-avatar-trungquandev-02.jpg" alt=""> 
// <strong>Trung Quân</strong> đã gửi cho bạn một lời mời kết bạn!
// </span><br><br><br>


	   
       
           