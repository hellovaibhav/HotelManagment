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

        var mailOptions = {
            from: senderMail,
            to: body.guestEmail,
            subject: `${body.guestName} your Room has been Booked`,
            text: `You can check in into room ${body.roomNumber} from ${startDate} at ${startTime} ans stay back till ${endDate} at ${endTime} amount recived is ${body.amountRecived}`,
            html: `<html><body align=\"center\" bgcolor=\"#EDF1D6\"><p>You can check into room number</p><br><h1> ${body.roomNumber}</h1><br><p>amount recived is</p><h1>${body.amountRecived}</h1><h2>${startDate} ${startTime} </h2>to <h2>${endDate} ${endTime}  </h2><br><br><br><p align=\"left\"> This is a system generated email. Please do not reply to this message. </p> <br><br><div align=\"left\"><h4>Hotel Managment System</h4><h5>Reminder Mail | HM <br>dev.vbhv@gmail.com<br></h5><h6>IIIT Ranchi, Khelgaon Campus, Ranchi, Jharkhand</h6></div></body></html>`
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

export const sendCancellationMail = async (body) => {
    try {
        var mailOptions = {
            from: senderMail,
            to: body.guestEmail,
            subject: `${body.guestName}  your room booking has been cancelled`,
            text: `You booking for room number ${body.roomNumber} has been cancelled amount refunded is ${body.refund}`,
            html: `<html><body align=\"center\" bgcolor=\"#EDF1D6\"><p>Your booking has been cancelled for room number </p><br><h1> ${body.roomNumber}</h1><br><p>amount refunded is</p><h1>${body.refund}</h1><br><br><br><p align=\"left\"> This is a system generated email. Please do not reply to this message. </p> <br><br><div align=\"left\"><h4>Hotel Managment System</h4><h5>Reminder Mail | HM <br>dev.vbhv@gmail.com<br></h5><h6>IIIT Ranchi, Khelgaon Campus, Ranchi, Jharkhand</h6></div></body></html>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
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
    }
};
