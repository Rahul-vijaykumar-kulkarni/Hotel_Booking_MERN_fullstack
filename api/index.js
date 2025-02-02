import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";
import cors from "cors";



const app = express();

dotenv.config();

mongoose.set("strictQuery", true); //remove this line if error

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

// API endpoint to get the number of users
// app.get("/api/users/count", async (req, res) => {
//   try {
//     const userCount = await User.countDocuments(); // no filter
//     res.json({ count: userCount });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err });
//   }
// });


const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  connect();
  console.log(`Connected to backend at port ${PORT}.`);
});
