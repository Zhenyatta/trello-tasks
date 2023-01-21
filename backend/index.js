import fs from "fs";
import express from "express";

const app = express();

let pageVisitedTimesSession = 0;
let pageVisitedTimesTotal = 0;

try {
  if (fs.existsSync("temp/my-counter-visited-times.txt")) {
    (pageVisitedTimesTotal = Number(fs.readFileSync("temp/my-counter-visited-times.txt", "utf8")))
  }
} catch (e) {
  console.log(e);
}

app.get("/", (req, res) => {
  ++pageVisitedTimesSession;

  res.status(200).send(
    `This page was visited ${++pageVisitedTimesTotal
    } times in total, ${pageVisitedTimesSession} out of which was during the current code execution session ) `
  );

  try {
    fs.writeFileSync("temp/my-counter-visited-times.txt", String(pageVisitedTimesTotal));
  } catch (e) {
    console.log(e);
  }
});

app.listen(8080);
