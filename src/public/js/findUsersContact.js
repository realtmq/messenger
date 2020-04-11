function callFindUser(element){
	if(element.which === 13 || element.type === "click")
	{
		let keyword=$("#input-find-users-contact").val();
		// let regexKeyword= new RegExp(/^[a-zA-Z\-]+$/);
		// if(!keyword.length)
		// {
		// 	alertify.notify("Bạn chưa nhập từ khóa","error",7);
		// 	return false;
		// }
		// if(regexKeyword.test(keyword)){
		// 	alertify.notify("Key word khong co dau cach...","error",7);
		// 	return false;
		// }
		$.get("/contact/find-users/"+keyword,function(data){
			$("#find-user ul").html(data);
			addContact(); //js/addContact.js
			undoAddContact();//js/undoAddContact.js
		});
	}
}

$(document).ready(function(){
	$("#input-find-users-contact").bind("keypress",callFindUser);
	$("#btn-find-users-contact").bind("click",callFindUser);
});