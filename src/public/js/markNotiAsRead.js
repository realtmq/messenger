function markNotificationAsRead(targetUser){
	$.ajax({
			url:"/notification/mark-all-as-read",
			type:"put",
			data:{targetUser:targetUser},
			success: function(result){
				if(result){
					targetUser.forEach(function(uid){
						$(".noti_content").find("div[data-uid="+uid+"]").removeClass("notification-unread");
						$("ul.list-notifications").find("li>div[data-uid="+uid+"]").removeClass("notification-unread");
					});
					decreaseNotiNavbar("noti_counter",targetUser.length);
				}
			}	
		});
}

$(document).ready(function(){
	$("#popup-mark-noti-as-read").bind("click",function(){
		let targetUser= [];
		$(".noti_content").find("div.notification-unread").each(function(index,notification){
			targetUser.push($(notification).data("uid"));
		});
		console.log(targetUser);
		markNotificationAsRead(targetUser);
	});

	$("#modal-mark-noti-as-read").bind("click",function(){
		let targetUser= [];
		$("ul.list-notifications").find("li>div.notification-unread").each(function(index,notification){
			targetUser.push($(notification).data("uid"));
		});
		markNotificationAsRead(targetUser);
	});
});