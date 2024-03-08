import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const senderMail = process.env.MAILID;
const senderPass = process.env.MAILPASS;

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
  port: 587,
  secure: false, 
    auth: {
        user: senderMail,
        pass: senderPass,
    },
});

export const sendMail = async (startTime, startDate, endTime, endDate, body) => {

    try {
        console.log(senderMail);
        console.log(senderPass);
        console.log(body);

        var mailOptions = {
            from: senderMail,
            to: body.guestEmail,
            subject: `${body.guestName} your Room has been Booked`,
            text: `You can check in into room ${body.roomNumber} on ${startDate} at ${startTime} ans stay back till ${endDate} at ${endTime}`,
            html: `<html><body align=\"center\" bgcolor=\"#EDF1D6\"><p>You can check into room number</p><br><h1> ${body.roomNumber}</h1><br><h2>${startDate} ${startTime} </h2>to <h2>${endDate} ${endTime}  </h2><br><br><br><p align=\"left\"> This is a system generated email. Please do not reply to this message. </p> <br><br><div align=\"left\"><h4>Hotel Managment System</h4><h5>Reminder Mail | HM <br>dev.vbhv@gmail.com<br></h5><h6>IIIT Ranchi, Khelgaon Campus, Ranchi, Jharkhand</h6></div></body></html>`
        };

        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                // throw (err);
            } else {
                console.log("Email Sent" + info.response);

                return info.response;
            }
        });

    } catch (err) {
        console.log(err);
        // throw (err);
    }

};
