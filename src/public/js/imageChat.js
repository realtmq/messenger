function imageChat(divId){
  $('#image-chat-'+divId).unbind("change").on("change",function(){
  	let fileData=$(this).prop("files")[0];
		let match=["image/png","image/jpg","image/jpeg"];
		let limit = 1048576; ///1MB

        //VALIDATE AVATAR CLIENT-SIDE
		if($.inArray(fileData.type,match) ===-1)
		{
			alertify.notify("kieu file khong hop le,chi chap nhan jpg,jpeg,png","error",7);
			$(this).val= null;
			return false;
		}
		if(fileData.size>limit)
		{
			alertify.notify("chi chap nhan file anh duoi 1MB","error",7);
 			$(this).val= null;
			return false;
		}
		
		let targetId=$(this).data("chat");

		let messageFormData=new FormData();
		messageFormData.append("my-image-chat",fileData);
		messageFormData.append("uid",targetId);

		if($(this).hasClass("chat-in-group")){
			messageFormData.append("is-chat-group",true);
		} 

		$.ajax({
		url:"/message/send-message-image",
		type:"post",
		cache:false,
		contentType:false,
		processData:false,
		data:messageFormData,
		success: function(result){
			console.log(result);
		},
		error: function(error){
			alertify.notify(error.responseText,"error",7);
		}
	});
  });
}