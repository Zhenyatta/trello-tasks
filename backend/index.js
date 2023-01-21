import fs from "fs";
import express from "express";

const app = express();

let sessionCounter = 0;
let counter;

try {
  fs.existsSync("temp/my-counter-visited-times.txt")
    ? (counter = fs.readFileSync("temp/my-counter-visited-times.txt", "utf8"))
    : (counter = 0);
} catch (e) {
  console.log(e);
}

app.get("/", (req, res) => {
  sessionCounter++;
  counter = parseInt(counter);
  res.send(
    `This page was visited ${
      counter + sessionCounter
    } times in total, ${sessionCounter} out of which was during the current code execution session ( statuscode:${
      res.statusCode
    } ) `
  );

  let str = JSON.stringify(counter + sessionCounter);
  fs.writeFile("temp/my-counter-visited-times.txt", str, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
});

app.listen(8080);
