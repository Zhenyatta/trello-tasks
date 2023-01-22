import fs from "fs";
import express from "express";

const MY_COUNTER_VISITED_TIMES_FILE_PATH = 'temp/my-counter-visited-times.txt'

const app = express();

let pageVisitedTimesSession = 0;
let pageVisitedTimesTotal = 0;

try {
  if (fs.existsSync(MY_COUNTER_VISITED_TIMES_FILE_PATH)) {
    pageVisitedTimesTotal = Number(fs.readFileSync(MY_COUNTER_VISITED_TIMES_FILE_PATH, "utf8"))
  }
} catch (e) {
  console.log(e);
}

app.get("/", (req, res) => {
  ++pageVisitedTimesSession;
  ++pageVisitedTimesTotal;

  res.status(200).send(
    `This page was visited ${pageVisitedTimesTotal
    } times in total, ${pageVisitedTimesSession} out of which was during the current code execution session ) `
  );

  try {
    fs.writeFileSync(MY_COUNTER_VISITED_TIMES_FILE_PATH, String(pageVisitedTimesTotal));
  } catch (e) {
    console.log(e);
  }
});

app.listen(8080);
