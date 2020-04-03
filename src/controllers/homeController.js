import {notification} from "./../services/index";
let getHome= async (req,res) =>{
	//get 10 latest noti in dab
	let notifications=await notification.getNotifications(req.user._id);
	//get all unread notification
	let countUnreadNotifications =await notification.getUnreadNotifications(req.user._id);
	return res.render("main/home/home",{
		errors: req.flash("errors"),
		success:req.flash("success"),
		user:req.user,
		notifications:notifications,
		countUnreadNotifications:countUnreadNotifications
	});
    };

module.exports={
	getHome:getHome
};