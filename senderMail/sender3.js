import {connect, JSONCodec} from "nats";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});

async function main(email, token, hostFront, recPassPathFront) {
    const info = await transporter.sendMail({
        from: process.env.SMTP_USERNAME, // sender address
        to: email, // list of receivers
        subject: "Email confirm", // Subject line
        html:
            `
                <h1>Welcome friend</h1>
                <p>
                   <a href="${hostFront + recPassPathFront + token}">click here</a> to reset your password.
                </p>
            `,
    });
}


const nc = await connect();
const js = nc.jetstream();
const consumer = await js.consumers.get('my_stream', 'consumer');
const JCodec = JSONCodec();

while (true) {
    console.log("waiting for messages");
    const messages = await consumer.consume();
    try {
        for await (const m of messages) {
            const data = JCodec.decode(m.data);
            console.log(m.seq, data);
            await main(data.email, data.token, data.hostFront, data.recPassPathFront)
            m.ack();
        }
    } catch (err) {
        console.log(`consume failed: ${err.message}`);
    }
}




// const JCodec = JSONCodec();
// const betweenMessages = Number(process.env.DELAY);
// let whenWasLastSent = 0;
// const sub = nc.subscribe("mail");
//
//
//
// const func = async function()  {
//     for await (const m of sub) {
//         const data = JCodec.decode(m.data);
//         let delay = 0;
//         const now = Date.now()
//         if (now < whenWasLastSent + betweenMessages) {
//             delay = betweenMessages - (now - whenWasLastSent)
//             whenWasLastSent = whenWasLastSent + betweenMessages
//         } else {
//             whenWasLastSent = now
//         }
//
//         setTimeout(main, delay, data.email, data.token, data.hostFront, data.recPassPathFront)
//         // setTimeout(console.log, delay, 'sent')
//     }
//     console.log("subscription closed");
// }
//
// func().catch(console.error)
