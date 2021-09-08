const express = require("express");
const router = express.Router();
const File = require("../models/file.js");

router.get("/:uuid", async function (req, res) {
  const file = await File.findOne({ uuid: req.params.uuid });
  if (!file) {
    return res.render("downloads.ejs", { error: "Link has been expired" });
  }

  const filePath = `${__dirname}/../${file.path}`;

  // To download file
  res.download(filePath);
});

module.exports = router;
