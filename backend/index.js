import fs from 'fs';
import express from 'express';
import { VISIT_COUNTER_FILE_PATH } from './constants.js'

const app = express();

let pageVisitedTimesSession = 0;

let jsonObjForCounter = {
  pageVisitedTimesTotal: 0,
  pageVisitedTimesMaxDurSession: 0,
};

try {
  if (fs.existsSync(VISIT_COUNTER_FILE_PATH)) {
    jsonObjForCounter = JSON.parse(fs.readFileSync(VISIT_COUNTER_FILE_PATH, "utf8"))
  }
} catch (e) {
  console.log(e);
}

app.get('/api/v1/my-counter', (req, res) => {

  res.status(200).json(jsonObjForCounter);
})

app.get("/my-counter", (req, res) => {
  pageVisitedTimesSession++;
  jsonObjForCounter.pageVisitedTimesTotal++;

  if (pageVisitedTimesSession > jsonObjForCounter.pageVisitedTimesMaxDurSession) {
    jsonObjForCounter.pageVisitedTimesMaxDurSession = pageVisitedTimesSession;
  }

  res.status(200).send(
    `This page was visited ${jsonObjForCounter.pageVisitedTimesTotal}
    times in total, ${pageVisitedTimesSession} out of which was during the current code execution session.
    Maximum page visits during a session ${jsonObjForCounter.pageVisitedTimesMaxDurSession} `
  );

  try {
    fs.writeFileSync(VISIT_COUNTER_FILE_PATH, JSON.stringify(jsonObjForCounter));
  } catch (e) {
    console.log(e);
  }
});

app.listen(8080);
