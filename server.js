// These are our required libraries to make the server work.
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import reload from 'livereload';
import connectReload from 'connect-livereload';

dotenv.config();

const __dirname = path.resolve();
const app = express();
const port = process.env.PORT || 3000;
const staticFolder = 'public';

let dataStore = []; // typically we would read into sqlite but yolo

// Add some auto-reloading to our server
const liveReloadServer = reload.createServer()
liveReloadServer.watch(path.join(__dirname, staticFolder));

// Configure express
app.use(connectReload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(staticFolder));



app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

function someAlgo(string, data) {
  return data.filter((f) => f.zipcode === string);// do a bunch of math to find the thing you want;
}

app.route('/api')
  .get(async (req, res) => {
    console.log('GET request detected');
    const data = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    const json = await data.json();
    console.log('data from fetch', json);
    res.json(json);
  })
  .post(async (req, res) => {
    console.log('POST request detected');
    console.log('Form data in res.body', req.body);
    console.log('Now send something back to your client');
    res.send({message: 'hello world'});
  });

app.listen(port, async () => {
  const police = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
  const hospital = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
  const fire = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');

  const pJson = await police.json();
  const hJson = await hospital.json();
  const fJson = await fire.json();

  dataStore = [...pJson, ...hJson, ...fJson];
  console.log(`Example app listening on port ${port}!`);
});

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
