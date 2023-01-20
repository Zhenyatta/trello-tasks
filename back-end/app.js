const express = require("express");

const app = express();

app.use("/", (req, res, next) => {
  res.send("<h1>yaay this is something hosted from backend</h1>");
});

app.listen(8080);
