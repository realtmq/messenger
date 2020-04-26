import {notification,contact,message} from "./../services/index";
import {bufferToBase64,lastItemOfArray,convertTimestampToHumanTime} from "./../helpers/messageHelper";
let getHome= async (req,res) =>{
	//Lấy 10 thông báo gần nhất trong database
	let notifications=await notification.getNotifications(req.user._id);
	//get all unread notification
	let countUnreadNotifications =await notification.getUnreadNotifications(req.user._id);

	//get contact
	let contacts = await contact.getContacts(req.user._id);
    //get contact sent
    let contactsSent = await contact.getContactsSent(req.user._id);
	//get contact received
	let contactsReceived = await contact.getContactsReceived(req.user._id);
     // bien dem thong bao tai contact modal
	let countContact= await contact.countAllContacts(req.user._id);
	let countContactSent = await contact.countAllContactsSent(req.user._id);
	let countContactReceived = await contact.countAllContactsReceived(req.user._id);
	let countContactNotiNavbar=countContactSent+countContactReceived;

	//lấy các cuộc trò chuyện trong database 
	let getAllConversationItems = await message.getAllConversationItems(req.user._id);
	let getAllConversationWithMessages= getAllConversationItems.getAllConversationWithMessages;

	return res.render("main/home/home",{
		errors: req.flash("errors"),
		success:req.flash("success"),
		user:req.user,
		notifications:notifications,
		countUnreadNotifications:countUnreadNotifications,
		contacts:contacts,
		contactsSent:contactsSent,
		contactsReceived:contactsReceived,
		countContacts:countContact,
		countContactsSent:countContactSent,
		countContactsReceived:countContactReceived,
		countContactNotiNavbar:countContactNotiNavbar,
		getAllConversationWithMessages:getAllConversationWithMessages,
		bufferToBase64:bufferToBase64,
		lastItemOfArray:lastItemOfArray,
		convertTimestampToHumanTime:convertTimestampToHumanTime
	});
    };

module.exports={
	getHome:getHome
};