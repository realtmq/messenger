$(document).ready(function(){
	$("#link-read-more-contact-received").bind("click",function(){ // bắt sự kiện "xem thêm"
		let skipNumber=$("#request-contact-received").find("li").length; 
		$("#link-read-more-contact-received").css("display","none"); // ẩn nút xem thêm
		$(".read-more-contact-received-loader").css("display","inline-block"); //hiện loader

		$.get('/contact/read-more-contacts-received?skipNumber='+skipNumber,function(newContactUsers){
			if(newContactUsers.length===0) // trường hợp không còn lời mời kết bạn nào 
			{
				alertify.notify("Khong con ban moi","error",7);
				$("#link-read-more-contact-received").css("display","inline-block"); //hiện lại nút "xem thêm"
		        $(".read-more-contact-received-loader").css("display","none"); // ẩn đi loader
				return false; 
			}  //
            // trường hợp lấy thêm được lời mời kết bạn mới trong db
			newContactUsers.forEach(function(user){
                // render ra các lời mời kết bạn mới (client-side-rendering)
				$("#request-contact-received").find("ul").append('<li class="_contactList" data-uid="'+user._id+'">'+
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
                                            '<div class="user-accept-contact-received" data-uid="'+user._id+'">'+
                                                'Chấp nhận'+
                                            '</div>'+
                                            '<div class="delete-add-friend-request action-danger" data-uid="'+user._id+'">'+
                                                'Xóa yêu cầu'+
                                            '</div>'+
                                        '</div>'+
                                    '</li>');
			});
            deleteAddFriendRequest(); // Gọi hàm xóa lời mời kết bạn cho các thẻ LI mới được render bên trên
            acceptAddFriendRequest(); // Gọi hàm chấp nhận lời mời kết bạn cho các thẻ li mới được render
			$("#link-read-more-contact-received").css("display","inline-block");  //hien nut xem them
		    $(".read-more-contact-received-loader").css("display","none");  //ẩn đi loader
		});
	});
});