import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import UserModel from "./models/user.js";

mongoose.connect("mongodb+srv://packarit:6543210@cluster0.egattjp.mongodb.net/");

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "https://packar-it-9i79.vercel.app/",
    methods: ["GET", "POST"],
  },
});
 
io.on("connection", async (socket) => {
  console.log(
    `A user connected: ${socket.userInfo ? socket.userInfo.email : "Guest"} - ${
      socket.id
    }`
  );

  const user = await UserModel.findById(socket.userId);

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });

  socket.on("send_message", (data) => {
    console.log("Mensaje recibido:", data);
    socket.broadcast.emit("receive_message", data);
    socket.broadcast.emit("alert_new_message", {
      message: "Nuevo mensaje de !",
    });
  });
});

const PORT = process.env.PORT || 10000;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});