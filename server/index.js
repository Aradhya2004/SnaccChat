import e from "express";
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import mongoose, { mongo } from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";
import setupSocket from "./socket.js";

dotenv.config()

const app = e()
const port = process.env.PORT || 3000
const databaseURL = process.env.MONGO_DB

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET","POST","PUT","PATCH", "DELETE"],
    credentials: true, 
}))

app.use("/uploads/profiles", e.static("uploads/profiles"));
app.use("/uploads/files", e.static("uploads/files"));

app.use(cookieParser());
app.use(e.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes)
app.use("/api/messages", messagesRoutes);
app.use("/api/channels", channelRoutes);

const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

setupSocket(server);

mongoose
    .connect(databaseURL)
    .then(() => console.log("DB Connection Successfull"))
    .catch(err => console.log(err.message))