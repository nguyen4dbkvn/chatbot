'use strict';

const
   express = require('express'),
   request = require('request'),
   bodyParser = require('body-parser'),
   app = express().use(bodyParser.json());

let VERIFY_TOKEN = "EAAEOCh2yDjwBAKLdOw21Rf132ck5V7jsWLiTHxZBBj9u4b5aH8BTmHJdMXg2UW3VjkxiMJvovpWWwipMSDsVrgMn4o9Qe3hVKP8p2F1RjVxii1F2lgNOAAE6ZAQJo7QIZAIq2zZCUZA15qeouBIbRCths4HspgK3e35wrXh2lZBjMNDuIZAvyaU";

app.listen(process.env.PORT || 4000, () => console.log('webhook is listening.'));

app.get('/', (req, res) => {
	res.status(200).send('Geted!');
});

app.post('/webhook', (req, res) => {
   let body = req.body;

   if (body.object === 'page') {
      body.entry.forEach(function (entry) {
         entry.messaging.forEach(function (webhookEvent) {
			 let senderId = webhookEvent.sender.id;
			 let recipientId = webhookEvent.recipient.id;
			 let timestamp = webhookEvent.timestamp;
			 let msgText = webhookEvent.message.text;
			 console.log("senderId: ", senderId);
			 console.log("recipientId: ", recipientId);
			 console.log("timestamp: ", timestamp);
			 console.log("msgText: ", msgText);
			 sendReplyMessage(recipientId, senderId, msgText);
		 });
		 
      });

      res.status(200).send('OK');
   }
   else {
      res.sendStatus(404);
   }
});

app.get('/webhook', (req, res) => {

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


function sendReplyMessage(senderId, recipientId, receivedMsg) {
	reques({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {
			access_token: VERIFY_TOKEN,
		},
		method: 'POST',
		json: {
			sender: {
				id: senderId
			}
			recipient: {
				id: recipientId
			},
			message: {
				text: "[Bot] " + receivedMsg 
			}
		}
	});
}