const express = require("express");

const router = express.Router();

router.get("/bob", (req, res) => {
  res.send("OK");
});

module.exports = router;
