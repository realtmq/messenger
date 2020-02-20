import nodeMailer from "nodemailer";
let adminEmail="quangtm.bkhn@gmail.com";
let adminPassword="toilasodeep";
let mailHost="smtp.gmail.com";
let mailPort=587;	

let sendMail=(to,subject,htmlContent)=>{
	let transporter=nodeMailer.createTransport({
		host:mailHost,
		port:mailPort,
		secure:false,
		auth:
		{
			user:adminEmail,
			pass:adminPassword
		}
		});
	let options={
		from:adminEmail,
		to: to,
		subject: subject,
		html:htmlContent
	}

	return transporter.sendMail(options) //default a promise

}

module.exports=sendMail;