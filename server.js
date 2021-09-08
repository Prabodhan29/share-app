const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

// Cors
const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS.split(","),
};

const PORT = process.env.PORT || 3000;

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

app.get("/", function (req, res) {
  res.render("download.ejs");
});

app.listen(PORT, console.log(`Listening on port ${PORT}.`));
