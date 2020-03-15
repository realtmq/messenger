export const transValidation={
	email_incorrect:"email phải có định dạng example@email.com",
	gender_incorrect:"Chon gioi tinh phu hop",
	password_incorrect:"Mật khẩu phải có ít nhất 8 kí tự,chữ hoa,chữ thường và kí tự đặc biệt",
	password_confirmation_incorrect:"Nhập lại mật khẩu chưa chính xác",
	update_username:"User name tu 3-17 ki tu,khong co cac ki tu dac biet",
	update_gender:"Hack cl",
	update_address:"dia chi tu 4-40 ki tu",
	update_phone:"bat dau bang 0,gom 10-11 ki tu"
}

export const transErrors={
	account_in_use:"Email đã được đăng kí",
	account_is_deleted:"Tài khoản của bạn đã bị xóa,hãy liên hệ với bộ phận cskh để biết thêm chi tiết",
	account_not_active:"Tài khoản của bạn chưa được active,hãy kiểm tra lại Email",
	account_undefined:"Tai khoan khong ton tai",
	token_undefined:"Token không tồn tại",
	login_failed:"sai tài khoản hoặc mật khẩu!",
	server_error:"có lỗi phía server",
	avatar_type_error:"File phai co dang jpg,jpeg,png",
	avatar_size_error:"dung luong qua 1 mb",
	password_invalid:"Ban nhap sai mat khau hien tai"
}

export const transSuccess={
	userCreated:(userEmail)=>{
		return 'Tài khoản được đăng kí thành công.Truy cập <strong>'+userEmail+'</strong> để active tài khoản trước khi đăng nhập';		
	},
	accountActivated:'Kích hoạt thành công,bạn đã có thể đăng nhập vào hệ thống',
	loginSuccess:(username)=>{
		return "Xin chào"+ username+",chào mừng đến với ứng dụng Messenger";

	},
	logout_success:"Đăng xuất tài khoản thành công",
	user_info_updated:"Cap nhat thong tin nguoi dung thanh cong",
	user_password_updated:"Thay doi mat khau thanh cong"
}

export const transMail={
	subject:"Messenger xác nhận tài khoản." ,
	template: (linkVerify)=>{
		return '<h2>Bạn nhận được email này vì đã đăng kí tài khoản ứng dụng Messenger</h2><h3>Vui lòng click vào liên kết bên dưới để xác nhận tài khoản</h3><h3><a href="'+linkVerify+'" target="blank">'+linkVerify+'</a></h3>';
	},
	send_failed:"có lỗi trong quá trình gửi email,vui lòng kiểm tra lại"
}