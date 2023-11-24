const nodemailer = require('nodemailer');
import { AccountSetting } from "../account-settings/account-config";

export async function sendEmailToMobile(emailTextMessage: String ){
    const ACCOUNT = AccountSetting
    const transporter = nodemailer.createTransport({
        service: ACCOUNT.SERVICE,
        port: ACCOUNT.PORT,
        auth: {
        user: ACCOUNT.USER,
        pass: ACCOUNT.PASS,
    }
});

await transporter.sendMail({
    from: ' "<Name of person>" <email@gmail.com>', // Provid email being sent from
    to: " <email@yahoo.com>", // list of receivers 
    subject: "Web Scraper Price drop on an item", // Subject line
    text: `A price drop for an item you're looking at is on sale!\n` + 
    `${emailTextMessage}` ,
    //html: `<b>${emailTextMessage}</b>`, // html body
  }).then(info => {
    console.log({info});
  }).catch(console.error);
  await transporter.verify().then(console.log).catch(console.error);
}


