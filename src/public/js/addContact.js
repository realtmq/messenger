//phía người gửi yêu cầu kết bạn
function addContact(){
	$(".user-add-new-contact").bind("click",function(){
		let targetId= $(this).data("uid");
		$.post("/contact/add-new",{uid: targetId},function(data){
			if(data.success){
				$("#find-user").find('div.user-add-new-contact[data-uid='+targetId+']').hide(); // ẩn đi nút thêm bạn bè
				$("#find-user").find('div.user-remove-request-contact[data-uid='+targetId+']').css("display","inline-block"); //hiện ra nút rút lại lời mời kết bạn
				increaseNotiContact("count-request-contact-sent"); //tăng 1 thông báo modal request-sent 
                increaseNotiNavbar("noti_contact_counter",1); //tăng 1 thông báo ở navbar
                
				//Lấy nội dung thẻ 'li'	của modal find-user chuyển sang modal request-sent			
				let userInfoHtml=$("#find-user").find('ul li[data-uid='+targetId+']').get(0).outerHTML; 
				$("#request-contact-sent").find("ul").prepend(userInfoHtml);
                undoAddContact(); //  js/undoAddContact  // Nạp hàm rút lại yêu cầu kết bạn
				socket.emit("add-new-contact",{contactId:targetId}); //gửi lên server id người dùng muốn kết bạn
			}
		});
	});
}

//phía người nhận được yêu cầu kết bạn
socket.on("response-add-new-contact",function(user){
	let noti= '<div class="notification-unread" data-uid="'+user.id+'"><img class="avatar-small" src="images/users/'+user.avatar+'" alt="">  <strong>'+user.username+'</strong> đã gửi cho bạn một lời mời kết bạn!</div>';
    $(".noti_content").prepend(noti);//Thêm thông báo ở pop-up
    $("ul.list-notifications").prepend('<li>'+noti+'</li>'); //thêm thông báo ở modal
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
                                                '<p>'+user.username+'</p>'+
                                            '</div>'+
                                            '<br>'+
                                            '<div class="user-address">'+
                                                '<span>&nbsp '+user.address+'</span>'+
                                            '</div>'+
                                            '<div class="user-accept-contact-received" data-uid="'+user.id+'">'+
                                                'Chấp nhận'+
                                            '</div>'+
                                            '<div class="delete-add-friend-request action-danger" data-uid="'+user.id+'">'+
                                                'Xóa yêu cầu'+
                                            '</div>'+
                                        '</div>'+
                                    '</li>';

    $("#request-contact-received").find("ul").prepend(userInfoHtml);
    deleteAddFriendRequest(); // gọi hàm xóa yêu cầu kết bạn khi vừa được render 
    acceptAddFriendRequest(); // gọi hàm thêm yêu cầu kết bạn khi vừa đươc render
})


// <span data-uid="${ user.id }">
// <img class="avatar-small" src="images/users/default-avatar-trungquandev-02.jpg" alt=""> 
// <strong>Trung Quân</strong> đã gửi cho bạn một lời mời kết bạn!
// </span><br><br><br>


	   
       
           