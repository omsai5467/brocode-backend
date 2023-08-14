const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/transfer.mp3");
});

app.listen(8081, () => console.log("listening on port 8080"));
