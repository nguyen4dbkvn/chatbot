'use strict';

const
   express = require('express'),
   bodyParser = require('body-parser'),
   app = express().use(bodyParser.json());

   
console.log("port: ", process.env.PORT);
app.listen(process.env.PORT || 4000, () => console.log('webhook is listening.'));

app.get('/', (req, res) => {
	res.status(200).send('Geted!');
});

app.post('/webhook', (req, res) => {
   let body = req.body;
   console.log("POST:", body);

   if (body.object === 'page') {
      body.entry.forEach(function (entry) {
         let webhookEvent = entry.messaging[0];
         console.log(webhookEvent);
      });

      res.status(200).send('EVENT_RECEIVED');
   }
   else {
      res.sendStatus(404);
   }
});

app.get('/webhook', (req, res) => {
   let VERIFY_TOKEN = "EAAEOCh2yDjwBAKLdOw21Rf132ck5V7jsWLiTHxZBBj9u4b5aH8BTmHJdMXg2UW3VjkxiMJvovpWWwipMSDsVrgMn4o9Qe3hVKP8p2F1RjVxii1F2lgNOAAE6ZAQJo7QIZAIq2zZCUZA15qeouBIbRCths4HspgK3e35wrXh2lZBjMNDuIZAvyaU";

   console.log("GET:", req.body);
   let mode = req.query['hub.mode'];
   let token = req.query['hub.verify_token'];
   let challenge = req.query['hub.challenge'];

   if (mode && token) {

      if (mode === 'subscribe' && token === VERIFY_TOKEN) {

         console.log('WEBHOOK_VERIFIED');
         res.status(200).send(challenge);
      }
      else {
         res.sendStatus(403);
      }
   }
});
