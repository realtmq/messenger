$(document).ready(function(){
	$("#link-read-more-contact").bind("click",function(){
		let skipNumber=$("#contacts").find("li").length;
		$("#link-read-more-contact").css("display","none");
		$(".read-more-contact-loader").css("display","inline-block");

		$.get('/contact/read-more-contacts?skipNumber='+skipNumber,function(newContactUsers){
			if(newContactUsers.length===0)
			{
				alertify.notify("Khong con ban moi","error",7);
				$("#link-read-more-contact").css("display","inline-block");
		        $(".read-more-contact-loader").css("display","none");
				return false; 
			}
			newContactUsers.forEach(function(user){
				$("#contacts").find("ul").append('<li class="_contactList" data-uid="'+user._id+'">'+
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
                                            '<div class="user-talk" data-uid="'+user._id+'">'+
                                                'Trò chuyện'+
                                            '</div>'+
                                            '<div class="user-remove-contact action-danger" data-uid="'+user._id+'">'+
                                                'Xóa liên hệ'+
                                            '</div>'+
                                        '</div>'+
                                    '</li>' 
                        );

			});
			$("#link-read-more-contact").css("display","inline-block");
		    $(".read-more-contact-loader").css("display","none");

		});
	});
});