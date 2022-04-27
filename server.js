// main file for my backend application
const express = require("express");
const cors = require("cors");
const app = express();

const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/userRecord";
mongoose.connect(url, { useNewUrlParser: true });
const con = mongoose.connection;
con.on("open", () => {
  console.log("connected...");
});
app.use(express.json());
 
const userRouter = require("./routes/users");
//configure dotenv
require("dotenv").config();
app.use(cors());
app.use("/api", userRouter);
app.listen(3000, () => {
  console.log("server started...");
});



