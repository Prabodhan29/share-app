const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

// Cors
const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS.split(","),
};

app.use(cors(corsOptions));

// Database connection
const connectDB = require("./config/db.js");
connectDB();

// Static assets
app.use(express.static("public"));

app.use(express.json());

// Set view engine
app.set("view engine", "ejs");

// Routes
app.use("/api/files", require("./routes/files.js"));
app.use("/files", require("./routes/show.js"));
app.use("files/downloads/", require("./routes/download.js"));

app.listen("3000", function () {
  console.log("Server is running on port 3000");
});
