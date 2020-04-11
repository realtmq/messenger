//action tại nơi người nhận được lời mời kết bạn

function deleteAddFriendRequest(){
	$(".delete-add-friend-request").unbind("click").on("click",function(){ //unbind để xóa duplicate hàm deleteAddFriendRequest()
		let targetId= $(this).data("uid"); //lấy id của người dùng trong thẻ LI
		//tạo 1 request ajax lên server 
		$.ajax({
			url:"contact/delete-add-friend-request",
			type:"delete",
			data:{uid:targetId},
			success:function(data){
				if(data.success){
					//chức năng xóa thông báo nhưng chưa làm :D
				// $(".noti_content").find('div[data-uid='+user.id+']').remove(); //xoa thong bao tai popup
	            // $("ul.list-notifications").find('li>div[data-uid='+user.id+']').parent().remove(); //xoa thong bao tai modal
	            // decreaseNotiNavbar("noti_counter",1);
	            decreaseNotiContact("count-request-contact-received"); //js/caculateNoti.js// giảm 1 ở modal nhận lời mời kết bạn 
	            decreaseNotiNavbar("noti_contact_counter",1); //js/caculateNotiNavbar.js// giảm 1 ở thông báo kết bạn thanh navbar
	            // xóa đi lời mời kết bạn ở modal nhận lời mời kết bạn
	            $("#request-contact-received").find('li[data-uid='+targetId+']').remove(); 
		     	socket.emit("delete-add-friend-request",{contactId:targetId}); //gửi lên server id người dùng muốn từ chối kết bạn
			    }
			}
		});
	});
}
 
 // action tại nơi người gửi lời mời kết bạn
socket.on("response-delete-add-friend-request",function(user){
	$("#find-user").find('div.user-add-new-contact[data-uid='+user.id+']').css("display","inline-block");//hien thi lai button them ban be
	$("#find-user").find('div.user-remove-request-contact[data-uid='+user.id+']').hide();//ẩn đi nút hủy yêu cầu kết bạn
    $("#request-contact-sent").find("li[data-uid="+user.id+"]").remove(); //xoa đi thẻ yêu cầu kết bạn tại modal request-sent
    decreaseNotiContact("count-request-contact-sent"); //js/caculateNoti.js //giảm 1 tại modal request-sent )
    decreaseNotiNavbar("noti_contact_counter",1); //js/caculateNotiNavbar.js//giảm 1 tại thông báo kết bạn thanh nav-bar
});

//nạp hàm khi load xong trang
$(document).ready(function(){
	deleteAddFriendRequest();
});     
