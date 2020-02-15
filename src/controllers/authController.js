let getLoginRegister = (req,res)=>{
	return res.render("auth/register");
    };

module.exports={
	getLoginRegister:getLoginRegister
};