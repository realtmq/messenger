import passport from "passport";
import passportFacebook from "passport-facebook";
import userModel from "./../../models/userModel";
import {transErrors,transSuccess} from "./../../../lang/vi";

let facebookStrategy = passportFacebook.Strategy;

//valid user type:facebook

let initPassportFacebook=()=>{
    passport.use(new facebookStrategy({
        clientID:"596957797555800",
        clientSecret:"4c663335effb007a9c4007485186672a",
        callbackURL:"https://localhost:9899/auth/facebook/callback",
    	passReqToCallback:true,
        profileFields:["email","gender","displayName"   ]
    },async (req,accessToken,refreshToken,profile,done )=>{
    	try{
            let user= await userModel.findByFacebookUid(profile.id);
            if(user){
                return done(null,user,req.flash("success",transSuccess.loginSuccess(user.username)));
            }
            console.log(profile);
            let newUserItem={
                username:profile.displayName,
                gender:profile.gender,
                local:{isActive:true},
                facebook:{
                    uid:profile.id,
                    token:accessToken,
                    email:profile.emails[0].value
                }

            }

            let newUser= await userModel.createNew(newUserItem);
            return done(null,newUser,req.flash("success",transSuccess.loginSuccess(newUser.username)));
            
    	}catch(error){
    		console.log(error);
        	return done(null,false,req.flash("errors",transErrors.server_error));

    	}
    }));
//save user id to session
    passport.serializeUser((user,done)=>{
    	done(null,user._id);
    });

    passport.deserializeUser((id,done)=>{
    	userModel.findUserById(id)
    	.then(user=>{
    		return done(null,user);
    	})
    	.catch(error=>{
    		return done(error,null);
    	})
    });
};

module.exports= initPassportFacebook;