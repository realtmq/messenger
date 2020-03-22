import session from "express-session";
import connectMongo from "connect-mongo";

let MongoStore=connectMongo(session);

//NOI LUU TRU SESSION O TRONG MONGODB
let sessionStore=new MongoStore({
	url:"mongodb://localhost/messenger",
	autoReconnect:true
	//autoRemove:"native"
});

let config=(app)=>{
	app.use(session({
		key:"express.sid",
		secret:"mySecret",
		store:sessionStore,
		resave:true,
		saveUninitialized:false,
		cookie:{
			maxAge: 86400000
		}
	}));

}; 

module.exports ={
	sessionStore:sessionStore,
	config:config
};