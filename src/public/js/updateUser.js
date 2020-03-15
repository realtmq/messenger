let userAvatar=null;
let userInfor={};
let originAvatarSrc=null;
let originUserInfo={};
let userUpdatePassword={};
function updateUserInfor(){
	$("#input-change-avatar").bind("change",function(){
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
		if(typeof(FileReader) != "undefined"){
			let imagePreview=$("#image-edit-profile");
			imagePreview.empty();
			let fileReader = new FileReader();
			fileReader.onload =function(element){
				$("<img>",{
					"src":element.target.result,
					"class": "avatar img-circle",
					"id":"user-modal-avatar",
					"alt":"avatar"
				}).appendTo(imagePreview);
			};
			imagePreview.show();
			fileReader.readAsDataURL(fileData);

			let formData= new FormData();
			formData.append("avatar",fileData);
			userAvatar=formData;
		}
	});

	$("#input-change-username").bind("change",function(){
		//VALIDATE CLIENT SIDE
		let username= $(this).val();
		let regexUsername= new RegExp("^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$");
        if(!regexUsername.test(username) || username.length<3 || username.length>17)
        {
        	alertify.notify("username 3-17 ki tu va khong co ki tu dac biet","error",7);
        	$(this).val(originUserInfo.username);
        	delete userInfor.username;
        	return false;
        }
		userInfor.username=$(this).val();
	});

	$("#input-change-gender-male").bind("click",function(){
		//validate
		let gender=$(this).val();
		if(gender !== "male")
		{
			alertify.notify("hack cl","error",7);
			$(this).val(originUserInfo.gender);
        	delete userInfor.gender;
        	return false;
		}
		userInfor.gender=$(this).val();
	}); 

	$("#input-change-gender-female").bind("click",function(){
		//validate
		let gender=$(this).val();
		if(gender !== "female")
		{
			alertify.notify("hack cl","error",7);
			$(this).val(originUserInfo.gender);
        	delete userInfor.gender;
        	return false;
		}
		userInfor.gender=$(this).val();
	}); 

	$("#input-change-address").bind("change",function(){
		//validate
		let address= $(this).val();
        if(address.length<3 || address.length>30 )
        {
        	alertify.notify("username 3-30 ki tu ","error",7);
        	$(this).val(originUserInfo.address);
        	delete userInfor.address;
        	return false;
        }
		userInfor.address=$(this).val();
	});

	$("#input-change-phonenumber").bind("change",function(){
		let phone= $(this).val();
		let regexPhone= new RegExp("^(0)[0-9]{9,10}$");
        if(!regexPhone.test(phone))
        {
        	alertify.notify("So dien thoai khong chinh xac","error",7);
        	$(this).val(originUserInfo.phone);
        	delete userInfor.phone;
        	return false;
        }
		userInfor.phone=$(this).val();
	});
//modal change passord

	$("#input-change-current-password").bind("change",function(){
		let currentPassword= $(this).val();
		let regexPassword= new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
        if(!regexPassword.test(currentPassword))
        {
        	alertify.notify("Mat khau khong dung dinh dang","error",7);
        	$(this).val(null);
        	delete userUpdatePassword.currentPassword;
        	return false;
        }
		userUpdatePassword.currentPassword=currentPassword;
	});

	$("#input-change-new-password").bind("change",function(){
		let newPassword= $(this).val();
		let regexPassword= new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
        if(!regexPassword.test(newPassword))
        {
        	alertify.notify("Mat khau khong dung dinh dang","error",7);
        	$(this).val(null);
        	delete userUpdatePassword.newPassword;
        	return false;
        }
		userUpdatePassword.newPassword=newPassword;
	});

	$("#input-change-confirm-new-password").bind("change",function(){
		let confirmNewPassword= $(this).val();

        if(!userUpdatePassword.newPassword){
        	alertify.notify("Ban chua nhap mat khau moi","error",7);
        	$(this).val(null);
        	delete userUpdatePassword.confirmNewPassword;
        	return false;
        }

        if(confirmNewPassword !== userUpdatePassword.newPassword){
        	alertify.notify("Mat khau khong trung khop","error",7);
        	$(this).val(null);
        	delete userUpdatePassword.confirmNewPassword;
        	return false;
        }
		userUpdatePassword.confirmNewPassword=confirmNewPassword;
	});
}


function callUpdateAvatar(){
	$.ajax({
		url:"/user/update-avatar",
		type:"put",
		cache:false,
		contentType:false,
		processData:false,
		data:userAvatar,
		success: function(result){
			console.log(result);
            
			$(".user-modal-alert-success").find("span").text(result.message);
			$(".user-modal-alert-success").css("display","block");	

			//change new navbar-avatar
			$("#navbar-avatar").attr("src",result.imageSrc);
			originAvatarSrc=result.imageSrc;	
			$("#input-btn-reset-update-user").click(); // autoclick reset button :D
		},
		error: function(error){
			console.log(error);
			//In loi ra man hinh
			$(".user-modal-alert-error").find("span").text(error.responseText);
			$(".user-modal-alert-error").css("display","block");
			//reset lai avatar cu
			$("#input-btn-reset-update-user").click(); // autoclick reset button :D

		}
	});
}

function callUpdateUserInfo(){
	$.ajax({
		url:"/user/update-info",
		type:"put",
		data:userInfor ,
		success: function(result){
			console.log(result);
            
			$(".user-modal-alert-success").find("span").text(result.message);
			$(".user-modal-alert-success").css("display","block");	

            //update originalUserinfo
            originUserInfo = Object.assign(originUserInfo,userInfor);
            console.log(originUserInfo);
            //update navbar username
            $("#navbar-username").text(originUserInfo.username);
	
			$("#input-btn-reset-update-user").click(); // autoclick reset button :D
		},
		error: function(error){
			console.log(error);
			//In loi ra man hinh
			$(".user-modal-alert-error").find("span").text(error.responseText);
			$(".user-modal-alert-error").css("display","block");
			//reset lai avatar cu
			$("#input-btn-reset-update-user").click(); // autoclick reset button :D

		}
	});

}

function callUpdateUserPassword(){
	$.ajax({
		url:"/user/update-password",
		type:"put",
		data:userUpdatePassword ,
		success: function(result){
            
			$(".user-modal-password-alert-success").find("span").text(result.message);
			$(".user-modal-password-alert-success").css("display","block");	

			$("#input-btn-reset-update-user").click(); // autoclick reset button :D
		},
		error: function(error){
			//In loi ra man hinh
			$(".user-modal-password-alert-error").find("span").text(error.responseText);
			$(".user-modal-password-alert-error").css("display","block");
			//reset lai avatar cu
			$("#input-btn-reset-update-user").click(); // autoclick reset button :D

		}
	});

};

$(document).ready(function(){
	originAvatarSrc= $("#user-modal-avatar").attr("src");
	originUserInfo={
		username:$("#input-change-username").val(),
		gender:($("#input-change-gender-male").is(":checked")) ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
		address:$("#input-change-address").val(),
		phone:$("#input-change-phonenumber").val()
	};

	updateUserInfor();

    // "luu lai" button
	$("#input-btn-update-user").bind("click",function(){
		if($.isEmptyObject(userInfor) && !userAvatar){
			alertify.notify("ban phai thay doi thong tin truoc khi gui","error",7);
			return false;
		}
		if(userAvatar){
	        callUpdateAvatar();
     	}

     	if(!$.isEmptyObject(userInfor)){
     		callUpdateUserInfo();
     	}
		// console.log(userAvatar);
		// console.log(userInfor);
	});
    
    //RESET BUTTON
	$("#input-btn-reset-update-user").bind("click",function(){
		userAvatar=null;
        userInfor={};
        //console.log(originUserInfo);
        $("#input-change-avatar").val(null);
        $("#user-modal-avatar").attr("src",originAvatarSrc);

        $("#input-change-username").val(originUserInfo.username);
        originUserInfo.gender === "male" ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click();
        $("#input-change-address").val(originUserInfo.address);
        $("#input-change-phonenumber").val(originUserInfo.phone);
	})


	//Luu lai password
		//Luu lai password
	$("#input-btn-update-user-password").bind("click",function(){
		if(!userUpdatePassword.currentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmNewPassword)
		{
			alertify.notify("Ban phai nhap day du cac truong","error",7);
			return false;
		}
		//Modal xac nhan thay doi mk
		Swal.fire({
            title: 'Bạn đã chắc chắn muốn thay đổi mật khẩu?',
            text: "Không thể hoàn tác,vì vậy hãy ghi nhớ mật khẩu cũ",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#2ECC71',
            cancelButtonColor: '#ff7675',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy bỏ'
          }).then((result) => {
          	if(!result.value){
          		$("#input-btn-cancel-update-user-password").click();
          		return false;
          	}
            callUpdateUserPassword();
          })
    });

    //reset button
    $("#input-btn-cancel-update-user-password").bind("click",function(){
    	userUpdatePassword={};
    	$("#input-change-current-password").val(null);
    	$("#input-change-new-password").val(null);
    	$("#input-change-confirm-new-password").val(null);
    });
});