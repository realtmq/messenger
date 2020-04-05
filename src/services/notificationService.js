import notificationModel from "./../models/notificationModel";
import userModel from "./../models/userModel";

// 
let getNotifications= (currentUserId,limit=10)=>{
	return new Promise(async (resolve,reject)=>{
		try{
			let notifications= await notificationModel.model.getByUserAndLimit(currentUserId,limit);
			let getNotiContent= notifications.map(async (notification)=>{
				let sender=await userModel.findUserById(notification.senderId);
				return notificationModel.contents.getContent(notification.type,notification.isRead,sender._id,sender.username,sender.avatar);
			}); 
			resolve(await Promise.all(getNotiContent));
		}catch(error){
			reject(error);
		}
	});
};

let getUnreadNotifications= (currentUserId )=>{
	return new Promise(async (resolve,reject)=>{
		try{
			let unreadNotifications= await notificationModel.model.getUnreadNotifications(currentUserId);
			resolve(unreadNotifications);
		}catch(error){
			reject(error);
		}
	});
};


let readMore= (currentUserId,skipNumber)=>{
	return new Promise(async (resolve,reject)=>{
		try{
			let newNotifications= await notificationModel.model.readMore(currentUserId,skipNumber,10);
			let getNotiContent= newNotifications.map(async (notification)=>{
				let sender=await userModel.findUserById(notification.senderId);
				return notificationModel.contents.getContent(notification.type,notification.isRead,sender._id,sender.username,sender.avatar);
			}); 
			resolve(await Promise.all(getNotiContent));

		}catch(error){
			reject(error);
		}

	});
}

let markAllAsRead=(currentUserId,targetUsers)=>{
	return new Promise(async (resolve,reject)=>{
		try{
			await notificationModel.model.markAllAsRead(currentUserId,targetUsers);
			resolve(true);
		}catch(error){
			console.log("have errors when mark all as read"+error);
			reject(false);
		}
	})
}

module.exports={
	getNotifications:getNotifications,
	getUnreadNotifications:getUnreadNotifications,
	readMore:readMore,
	markAllAsRead:markAllAsRead
}