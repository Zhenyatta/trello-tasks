import express from "express";
import session from "express-session";
import fs from "fs";

const app = express();

let counter;

fs.readFile("temp/my-counter-visited-times.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  } else {
    counter = Number(data);
  }
});

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  req.session.views = (req.session.views || 0) + 1;
  res.send(
    `This page was visited ${counter + req.session.views} times in total,  ${
      req.session.views
    } out of which was during the current code execution session`
  );
  let str = JSON.stringify(counter + req.session.views);
  fs.writeFile("temp/my-counter-visited-times.txt", str, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("File written successfully");
    }
  });
});

app.listen(8080);
