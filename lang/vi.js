export const transValidation={
	email_incorrect:"email phải có định dạng example@email.com",
	gender_incorrect:"Chon gioi tinh phu hop",
	password_incorrect:"Mật khẩu phải có ít nhất 8 kí tự,chữ hoa,chữ thường và kí tự đặc biệt",
	password_confirmation_incorrect:"Nhập lại mật khẩu chưa chính xác"
}

export const transErrors={
	account_in_use:"Email đã được đăng kí",
	account_is_deleted:"Tài khoản của bạn đã bị xóa,hãy liên hệ với bộ phận cskh để biết thêm chi tiết",
	account_not_active:"Tài khoản của bạn chưa được active,hãy kiểm tra lại Email"
}

export const transSuccess={
	userCreated:(userEmail)=>{
		return 'Tài khoản được đăng kí thành công.Truy cập <strong>${userEmail}</strong> để active tài khoản trước khi đăng nhập';		
	}
}