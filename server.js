const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require("uuid");
// const { ExpressPeerServer } = require("peer");

// const peerServer = ExpressPeerServer(server, {
//   path: "/myapp",
// });

// app.use("/peerjs", peerServer);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/create-room", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:roomId", (req, res) => {
  res.render("room", { roomId: req.params.roomId });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId); // this is a broadcast by default

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

server.listen(process.env.PORT || 3000);
