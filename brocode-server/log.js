const fs = require("fs");


text = fs.readFileSync("./logs/rotate-2023-06-27.log", "utf8");
const lines = text.split("\n");

fs.writeFile("whatsapp.txt", "", () => {
  console.log("Writing whatsapp.txt...");
});
fs.writeFile("instagram.txt", "", () => {
  console.log("Writing instagram.txt...");
});

function whatsapp() {
  const log = lines.map((line) => {
    try {
      const json = JSON.parse(line);

      let whatsapp_msg_decode = JSON.parse(json?.message);
      whatsapp_msg_decode = JSON.parse(whatsapp_msg_decode);
      if (
        whatsapp_msg_decode?.packageName === "com.whatsapp" &&
        whatsapp_msg_decode?.title !== "AJIO" &&
        whatsapp_msg_decode?.title !== "MyJio" &&
        whatsapp_msg_decode?.title !== "WhatsApp" &&
        whatsapp_msg_decode?.title !== "Flipkart"
      ) {
        const notification_template = `
			**********************START*******************************
			   *AppName* :   ${whatsapp_msg_decode?.packageName},
			   *tittle* : ${whatsapp_msg_decode?.title},
			   *Message* :   ${whatsapp_msg_decode?.text},
			   *Time* :   ${whatsapp_msg_decode?.timestamp}, 
		   ****************************************************************`;
        fs.appendFileSync("whatsapp.txt", `${notification_template}\n`);
      }
    } catch (e) {}
  });
}

function instagram() {
  const log = lines.map((line) => {
    try {
      const json = JSON.parse(line);
      let whatsapp_msg_decode = JSON.parse(json?.message);
      whatsapp_msg_decode = JSON.parse(whatsapp_msg_decode);

      if (whatsapp_msg_decode?.packageName === "com.instagram.android") {
        const notification_template = `
			**********************START*******************************
			   *AppName* :   ${whatsapp_msg_decode?.packageName},
			   *tittle* : ${whatsapp_msg_decode?.title},
			   *Message* :   ${whatsapp_msg_decode?.text},
			   *Time* :   ${whatsapp_msg_decode?.timestamp}, 
		   ****************************************************************`;
        fs.appendFileSync("instagram.txt", `${notification_template}\n`);
      }
    } catch (e) {
      // console.log("Error processing : " + e.message);
    }
  });
}

function snapchat() {
  const log = lines.map((line) => {
    try {
      const json = JSON.parse(line);
      // console.table(JSON.parse(json?.message));
      let whatsapp_msg_decode = JSON.parse(json?.message);
      whatsapp_msg_decode = JSON.parse(whatsapp_msg_decode);

      if (whatsapp_msg_decode?.packageName === "com.snapchat.android") {
        const notification_template = `
				**********************START*******************************
				   *AppName* :   ${whatsapp_msg_decode?.packageName},
				   *tittle* : ${whatsapp_msg_decode?.title},
				   *Message* :   ${whatsapp_msg_decode?.text},
				   *Time* :   ${whatsapp_msg_decode?.timestamp}, 
			   ****************************************************************`;
        fs.appendFileSync("snapchat.txt", `${notification_template}\n`);
      }
    } catch (e) {}
  });
}

function messegs() {
  const log = lines.map((line) => {
    try {
      const json = JSON.parse(line);
      // console.table(JSON.parse(json?.message));
      // console.table(json);
      let whatsapp_msg_decode = JSON.parse(json?.message);
      whatsapp_msg_decode = JSON.parse(whatsapp_msg_decode);
      // whatsapp_msg_decode = JSON.stringify(whatsapp_msg_decode);

      // console.log(JSON.parse(whatsapp_msg_decode));
      if (
        whatsapp_msg_decode?.packageName === "com.samsung.android.messaging"
      ) {
        const notification_template = `
			**********************START*******************************
			   *AppName* :   ${whatsapp_msg_decode?.packageName},
			   *tittle* : ${whatsapp_msg_decode?.title},
			   *Message* :   ${whatsapp_msg_decode?.text},
			   *Time* :   ${whatsapp_msg_decode?.timestamp}, 
		   ****************************************************************`;
        fs.appendFileSync("msg.txt", `${notification_template}\n`);
      }
    } catch (e) {}
  });
}

instagram();
whatsapp();
snapchat();
messegs();
