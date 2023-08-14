const fs = require("fs");

function GenarateReport() {
  const day = new Date();
  const month =
    day.getMonth() > 10
      ? day.getMonth()
      : "0" +
        (function () {
          return day.getMonth() + 1;
        })();

  const DAy = (function () {
    let x = `${day.getDate()}`;
    if (x.length === 1) {
      return "0" + x;
    }
    return x;
  })();

  const text = fs.readFileSync(
    `./logs/rotate-${day.getFullYear()}-${month}-${DAy}.log`,
    "utf8"
  );
  const lines = text.split("\n");
  const TOTAL_WHATSAPP_CHATS = whatsapp(lines);
  var date = new Date();
  var current_date =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  const WHATSAPP_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <title>BROCODE LOG MAILER </title>
  <style>
	table {
	  border-collapse: collapse;
	  width: 100%;
	  font-family: Arial, sans-serif;
	}

	th {
	  background-color: #f2f2f2;
	  color: #333;
	  font-weight: bold;
	  padding: 12px;
	  text-align: left;
	}

	td {
	  border-bottom: 1px solid #ddd;
	  padding: 8px;
	}

	tr:nth-child(even) {
	  background-color: #f9f9f9;
	}

	tr:hover {
	  background-color: #eaeaea;
	}
  </style>
</head>
<body>
  <h1>WhatsApp Chats   from BROCODE LOG MAILER ---- >    DATE :: ${current_date}</h1>
  <table>
  <tr>
  <th>Chat Name</th>
  <th>Msg</th>
  <th>Time</th>

</tr>
${TOTAL_WHATSAPP_CHATS}
  </table>
</body>
</html>

`;

  const total_instagram_msgs = instagram(lines);

  const INSTAGRAM_CHATS = `<!DOCTYPE html>
<html>
<head>
  <title>BROCODE LOG MAILER </title>
  <style>
	table {
	  border-collapse: collapse;
	  width: 100%;
	  font-family: Arial, sans-serif;
	}

	th {
	  background-color: #f2f2f2;
	  color: #333;
	  font-weight: bold;
	  padding: 12px;
	  text-align: left;
	}

	td {
	  border-bottom: 1px solid #ddd;
	  padding: 8px;
	}

	tr:nth-child(even) {
	  background-color: #f9f9f9;
	}

	tr:hover {
	  background-color: #eaeaea;
	}
  </style>
</head>
<body>
  <h1>Instgram Chats   from BROCODE LOG MAILER ---- >    DATE :: ${current_date}</h1>
  <table>
  <tr>
  <th>Chat Name</th>
  <th>Msg</th>
  <th>Time</th>

</tr>
${total_instagram_msgs}
  </table>
</body>
</html>

`;
  return WHATSAPP_TEMPLATE + INSTAGRAM_CHATS;
}

function whatsapp(lines) {
  let TOTAL_WHATSAPP_CHATS = ``;
  const log = lines.map((line) => {
    try {
      const json = JSON.parse(line);

      let whatsapp_msg_decode = JSON.parse(json?.message);
      whatsapp_msg_decode = JSON.parse(whatsapp_msg_decode);
      if (
        whatsapp_msg_decode?.packageName === "com.whatsapp" &&
        whatsapp_msg_decode?.title !== "WhatsApp"
      ) {
        const template = `<tr>
		<th>${whatsapp_msg_decode?.title}</th>
		<th>${whatsapp_msg_decode?.text}</th>
		<th>${whatsapp_msg_decode?.timestamp}</th>
	  </tr>	`;
        TOTAL_WHATSAPP_CHATS = TOTAL_WHATSAPP_CHATS + template;
      }
    } catch (e) {}
  });
  return TOTAL_WHATSAPP_CHATS;
}

function instagram(lines) {
  let TOTAL_WHATSAPP_CHATS = ``;
  const log = lines.map((line) => {
    try {
      const json = JSON.parse(line);

      let whatsapp_msg_decode = JSON.parse(json?.message);
      whatsapp_msg_decode = JSON.parse(whatsapp_msg_decode);
      if (whatsapp_msg_decode?.packageName === "com.instagram.android") {
        const template = `<tr>
		<th>${whatsapp_msg_decode?.title}</th>
		<th>${whatsapp_msg_decode?.text}</th>
		<th>${whatsapp_msg_decode?.timestamp}</th>
	  </tr>	`;
        TOTAL_WHATSAPP_CHATS = TOTAL_WHATSAPP_CHATS + template;
      }
    } catch (e) {}
  });
  return TOTAL_WHATSAPP_CHATS;
}

module.exports = { GenarateReport };
