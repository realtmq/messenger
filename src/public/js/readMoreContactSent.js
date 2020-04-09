$(document).ready(function(){
	$("#link-read-more-contact-sent").bind("click",function(){
		let skipNumber=$("#request-contact-sent").find("li").length;
		$("#link-read-more-contact-sent").css("display","none");
		$(".read-more-contact-sent-loader").css("display","inline-block");

		$.get('/contact/read-more-contacts-sent?skipNumber='+skipNumber,function(newContactUsers){
			if(newContactUsers.length===0)
			{
				alertify.notify("Khong con ban moi","error",7);
				$("#link-read-more-contact-sent").css("display","inline-block");
		        $(".read-more-contact-sent-loader").css("display","none");
				return false; 
			}
			newContactUsers.forEach(function(user){
				$("#request-contact-sent").find("ul").append('<li class="_contactList" data-uid="'+user._id+'">'+
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
                                            '<div class="user-remove-request-sent action-danger" data-uid="'+user._id+'">'+
                                                'Hủy yêu cầu'+
                                            '</div>'+
                                        '</div>'+
                                    '</li>'
                                    );
			});
			$("#link-read-more-contact-sent").css("display","inline-block");
		    $(".read-more-contact-sent-loader").css("display","none");

		});
	});
});