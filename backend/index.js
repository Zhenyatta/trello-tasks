import fs from 'fs';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { VISIT_COUNTER_FILE_PATH } from './constants.js';
import { FE_BUILD_PATH } from './env.js';

const app = express();

let pageVisitedTimesSession = 0;

let counters = {
  pageVisitedTimesTotal: 0,
  pageVisitedTimesMaxDurSession: 0,
};

try {
  if (fs.existsSync(VISIT_COUNTER_FILE_PATH)) {
    counters = JSON.parse(fs.readFileSync(VISIT_COUNTER_FILE_PATH, 'utf8'));
  }
} catch (e) {
  console.log(e);
}

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(FE_BUILD_PATH)));

app.get('/api/v1/my-counter', (req, res) => res.status(200).json(counters));

app.post('/api/v1/documents', (req, res) => res.status(200).send(req.body));

app.get('/my-counter', (req, res) => {
  pageVisitedTimesSession++;
  counters.pageVisitedTimesTotal++;

  if (pageVisitedTimesSession > counters.pageVisitedTimesMaxDurSession) {
    counters.pageVisitedTimesMaxDurSession = pageVisitedTimesSession;
  }

  res.status(200).send(
    `This page was visited ${counters.pageVisitedTimesTotal}
    times in total, ${pageVisitedTimesSession} out of which was during the current code execution session.
    Maximum page visits during a session ${counters.pageVisitedTimesMaxDurSession} `
  );

  try {
    fs.writeFileSync(VISIT_COUNTER_FILE_PATH, JSON.stringify(counters));
  } catch (e) {
    console.log(e);
  }
});

app.get('/env', (req, res) => res.status(200).send(`ENV: ${process.env.ENV}`));

app.get('*', (req, res) => res.sendFile(path.join(process.cwd(), FE_BUILD_PATH, 'index.html')));

app.listen(8080);
