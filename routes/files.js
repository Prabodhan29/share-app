const express = require("express");
let router = express.Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file.js");
const { v4: uuid4 } = require("uuid");
require("dotenv").config();

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage,
  limit: { fileSize: 1000000 * 100 },
}).single("myfile");

router.post("/", function (req, res) {
  // Store file
  upload(req, res, async function (err) {
    // Validate request
    if (!req.file) {
      res.json({ error: "Please add a file" });
    }

    if (err) {
      return res.status(500).send({ error: err.message });
    }

    // Store into database
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    // Response => download link
    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
});

router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom, expiresIn } = req.body;

  // Validate request
  if (!uuid || !emailTo || !emailFrom) {
    return res
      .status(422)
      .send({ error: "All fields are required except expiry." });
  }

  // Get data from db
  try {
    const file = await File.findOne({ uuid: uuid });
    if (file.sender) {
      return res.status(422).send({ error: "Email already sent once." });
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();

    // send mail
    const sendMail = require("../services/emailService.js");
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: "Prabodhan file sharing",
      text: `${emailFrom} shared a file with you.`,
      html: require("../services/emailTemplate.js")({
        emailFrom,
        downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email`,
        size: parseInt(file.size / 1000) + " KB",
        expires: "24 hours",
      }),
    })
      .then(() => {
        return res.json({ success: true });
      })
      .catch((err) => {
        return res.status(500).json({ error: "Error in email sending." });
      });
  } catch (err) {
    return res.status(500).send({ error: "Something went wrong." });
  }
});

module.exports = router;
