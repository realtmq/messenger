// tại phía người nhận được lời mời kết bạn
function acceptAddFriendRequest(){
	$(".user-accept-contact-received").unbind("click").on("click",function(){ 
		let targetUserId= $(this).data("uid");
		$.ajax({
			url:"contact/accept-add-friend-request",
			type:"put",
			data:{uid:targetUserId},
			success:function(data){
				if(data.success){
					let userInfor= $("#request-contact-received").find('ul li[data-uid='+targetUserId+']'); 
		            $(userInfor).find("div.user-accept-contact-received").remove();  //xóa nút chấp nhận yêu cầu kết bạn ở modal request-received
	             	$(userInfor).find("div.delete-add-friend-request").remove();  //xóa nút từ chối lời mời kết bạn ở modal request-received
		            //sau đó thêm 2 nút "trò chuyện" và "xóa liên hệ"
		            $(userInfor).find("div.contactPanel")
		            .append('<div class="user-talk" data-uid="'+targetUserId+'">'+
                        'Trò chuyện'+
                        '</div>'+
                        '<div class="user-remove-contact action-danger" data-uid="'+targetUserId+'">'+
                        'Xóa liên hệ'+
                        '</div>');
		                let userInforHTML=userInfor.get(0).outerHTML; //lấy ra mã html trong dom
		                $("#contacts").find("ul").prepend(userInforHTML); //chèn thêm thẻ user vào danh bạ 
		                $(userInfor).remove(); //xóa đi yêu cầu kết bạn ở modal request-received
		                decreaseNotiContact("count-request-contact-received"); 
		                increaseNotiContact("count-contacts");
		                decreaseNotiNavbar("noti_contact_counter",1);
				socket.emit("accept-add-friend-request",{contactId:targetUserId});  //gửi id người bạn vừa thêm lên server
				}
			}
		})
	});
}

// tại phía người gửi lời mời kết bạn
socket.on("response-accept-add-friend-request",function(user){
	let noti= '<div class="notification-unread" data-uid="'+user.id+'"><img class="avatar-small" src="images/users/'+user.avatar+'" alt="">  <strong>'+user.username+'</strong> đã chấp nhận lời mời kết bạn!</div>';
	$(".noti_content").prepend(noti); //thêm thông báo ở pop-up
	$("ul.list-notifications").prepend(noti); //thêm thông báo ở modal thông báo
	decreaseNotiContact("count-request-contact-sent") 
	increaseNotiContact("count-contacts");
	decreaseNotiNavbar("noti_contact_counter",1)
	increaseNotiNavbar("noti_counter",1)
	$("#request-contact-sent").find('ul li[data-uid='+user.id+']').remove(); //xóa gửi yêu cầu kết bạn ở modal request-sent
	$("#find-user").find('ul li[data-uid='+user.id+']').remove(); //xóa gửi yêu cầu kết bạn ở modal find-user 
	//thêm user vào modal danh bạ
	let userHTML = '<li class="_contactList" data-uid="'+user.id+'">'+
                            '<div class="contactPanel">'+
                                '<div class="user-avatar">'+
                                    '<img src="images/users/'+user.avatar+'" alt="">'+
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
                                '<div class="user-talk" data-uid="'+user.id+'">'+
                                    'Trò chuyện'+
                                '</div>'+
                                '<div class="user-remove-contact action-danger" data-uid="'+user.id+'">'+
                                    'Xóa liên hệ'+
                                '</div>'+
                            '</div>'+
                        '</li>';

    $("#contacts").find("ul").prepend(userHTML); //thêm vào modal danh bạ
});

$(document).ready(function(){
	acceptAddFriendRequest();
})