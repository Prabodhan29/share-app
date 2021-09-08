const express = require("express");
const router = express.Router();
const File = require("../models/file.js");

router.get("/:uuid", async function (req, res) {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.render("downloads.ejs", { error: "Link has been expired" });
    }

    return res.render("downloads.ejs", {
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      downloadLink: `${process.env.APP_BASE_URL}/files/downloads/${file.uuid}`,
    });
  } catch (err) {
    return res.render("downloads.ejs", { error: "Something went wrong" });
  }
});

module.exports = router;
