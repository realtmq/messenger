// tại phía người nhận được lời mời kết bạn
function unfriend(){
	$(".user-remove-contact").unbind("click").on("click",function(){ 
		let targetUserId= $(this).data("uid");
		let userName=$(this).parent().find("div.user-name p").text();
//Modal cảnh bảo hành động hủy kết bạn
		Swal.fire({
            title: "Bạn đã chắc chắn muốn xóa liên hệ với "+userName+"?",
            text: "Không thể hoàn tác hành động này",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2ECC71',
            cancelButtonColor: '#ff7675',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy bỏ'
          }).then((result) => {
         // trường hợp hủy hành động hủy kết bạn
          if(!result.value){
          		return false;
          	}
          //trường hợp xác nhận hủy kết bạn
          	$.ajax({
			url:"contact/unfriend",
			type:"delete",
			data:{uid:targetUserId},
			success:function(data){
				if(data.success){
					$("#contacts").find("ul li[data-uid="+targetUserId+"]").remove();
		            decreaseNotiContact("count-contacts"); 
		            socket.emit("unfriend",{contactId:targetUserId});  //gửi id người bạn vừa unfriend lên server
				}
			}
	        });

        })
    });
}

// tại phía người gửi lời mời kết bạn
socket.on("response-unfriend",function(user){
	decreaseNotiContact("count-contacts"); 
	$("#contacts").find('ul li[data-uid='+user.id+']').remove(); //xóa bạn bè vì bị hủy kết bạn
});
$(document).ready(function(){
	unfriend();
})