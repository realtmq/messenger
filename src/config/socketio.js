import passportSocketIO from "passport.socketio";
let configSocketIO =(io,cookieParser,sessionStore)=>{
	io.use(passportSocketIO.authorize({
	cookieParser:cookieParser,
	key:"express.sid",
	secret:"mySecret",
	store:sessionStore,
	success:(data,accept)=>{
		if(!data.user.logged_in){
			return accept("Invalid User",false)
		}
		return accept(null,true); 
	},
	fail:(data,message,error,accept)=>{
		if(error){
			console.log("fail to connection to socketio",message);
			return accept(new Error(message),false);
		}
	}
}))
}

module.exports = configSocketIO;