$(document).ready(function(){
	$("#link-read-more-notif").bind("click",function(){
		let skipNumber=$(".list-notifications").find("li").length;
		$("#link-read-more-notif").css("display","none");
		$(".read-more-notif-loader").css("display","inline-block");
		$.get('/notification/read-more?skipNumber='+skipNumber,function(notifications){
			if(notifications.length===0)
			{
				alertify.notify("Khong con thong bao moi","error",7);
				$("#link-read-more-notif").css("display","inline-block");
		        $(".read-more-notif-loader").css("display","none");
				return false;
			}
			notifications.forEach(function(notification){
				$("ul.list-notifications").append('<li>'+notification+'</li>'); //apend vao modal notif
			});
			$("#link-read-more-notif").css("display","inline-block");
		    $(".read-more-notif-loader").css("display","none");

		});
	});
});