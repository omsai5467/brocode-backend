// const { Client, LocalAuth } = require("whatsapp-web.js");
// const qrcode = require("qrcode-terminal");
// const fs = require("fs");
const logger = require("./loggerconfig/logger.js");

// const client = new Client({
//   authStrategy: new LocalAuth(),
//   puppeteer: {
//     handleSIGINT: false,
//     // puppeteer: {
//     //   args: ["--no-sandbox"],
//     // },

//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   },
// });

// client.on("qr", (qr) => {
//   console.log("QR RECEIVED", qr);
//   fs.appendFileSync("qrcode.txt", "latest\n");
//   fs.appendFileSync("qrcode.txt", `${qr}\n`);
//   qrcode.generate(qr, { small: true });
// });

// client.on("ready", () => {
//   console.log("client is ready");
//   sendWhatsapp_msg("+919182177651", "hello");
// });

// async function sendWhatsapp_msg(number, msg, type) {
//   //   if (whatsapp) {
//   console.log("sending number whatsapp msg");
//   try {
//     const chatId = number.substring(1) + "@c.us";
//     console.log("sending number whatsapp msg");

//     await client.sendMessage(chatId, msg);
//     return true;
//   } catch (EXP) {
//     console.log(EXP);
//     console.log(EXP);

//     return false;
//   }
// }

// client.initialize();

async function sendWhatsapp_msg(number, msg, type) {
  logger.info(msg);
}

module.exports = sendWhatsapp_msg;
