const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "ngodingtutorial@gmail.com",
        subject: "Thanks for joining us",
        text: `Welcome ${name}, hope you enjoy with us.`,
    });
};

const sendGoodByeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "ngodingtutorial@gmail.com",
        subject: "Good Bye",
        text: `Thank you ${name}, please give us your feedback.`,
    });
};

module.exports = {
    sendWelcomeEmail,
    sendGoodByeEmail,
};
