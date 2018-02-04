'use strict';

const
   express = require('express'),
   request = require('request'),
   bodyParser = require('body-parser'),
   app = express().use(bodyParser.json());

// let VERIFY_TOKEN = "EAAEOCh2yDjwBAKLdOw21Rf132ck5V7jsWLiTHxZBBj9u4b5aH8BTmHJdMXg2UW3VjkxiMJvovpWWwipMSDsVrgMn4o9Qe3hVKP8p2F1RjVxii1F2lgNOAAE6ZAQJo7QIZAIq2zZCUZA15qeouBIbRCths4HspgK3e35wrXh2lZBjMNDuIZAvyaU";
// let VERIFY_TOKEN = "EAAExEuqCQQYBAMCCfTGZCQ2MBYjjbTno3ZAOqDAP3EOVuLTsjayA1nDOPDZAdZAB6HZA48Yb3xUgCafeL8xO6ZA0HGjEkUJ1L2lSpKBw0GjhrZB1iuLDJgUjV0aPMlLkg4b2yunJCthyngbqnKrPsXV5miVdVrvMUmCGbII1FLsyu1DBSzdoycg"
let VERIFY_TOKEN = "EAAExEuqCQQYBAEoAAvQakcREZAINs8euF4n3A8lsvlIEHThI1kTjmxJiiTTMMvq4vUZCxCxUyNZC8UdpB3aOCXPc4FhZCKBlNtNnqZC3qkbvveXwnl2M0GEgcM1lY3ZBa31hjYdvAehdYujDsnRZAKGItJw15mQKgU4ZB3KLUMW6cglG9R7MnUJt"

app.listen(process.env.PORT || 4000, () => console.log('webhook is listening.'));

app.get('/', (req, res) => {
   var callback = function (err, res, body) {
      if (err) {
         console.error(err);
      }
      else {
         console.log(body);
      }
   }
   var content = req.query['content'];
   fptAI.getDateTime(content, callback);
   res.status(200).send('OK');
});

app.post('/webhook', (req, res) => {
   let body = req.body;

   if (body.object === 'page') {
      body.entry.forEach(function (entry) {
         if (entry.hasOwnProperty('changes')) {
            entry.changes.forEach(function (changes) {
               // if (changes.field === 'feed' && changes.value.item)
               console.log(changes);
               sendCommentReply(changes.value.from, changes.value.comment_id, changes.value.message);
            });
         }

         if (entry.hasOwnProperty('messaging')) {
            entry.messaging.forEach(function (webhookEvent) {
               let senderId = webhookEvent.sender.id;
               let recipientId = webhookEvent.recipient.id;
               let timestamp = webhookEvent.timestamp;
               console.log('\n---------------------');
               console.log(webhookEvent);
               if (webhookEvent.message) {
                  let msgText = webhookEvent.message.text;
                  console.log("msgText: ", msgText);
                  sendReplyMessage(recipientId, senderId, msgText);
               }
               console.log('---------------------\n');
            });
         }
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
	request({
		url: 'https://graph.facebook.com/v2.12/me/messages',
		qs: {
			access_token: VERIFY_TOKEN,
		},
		method: 'POST',
		json: {
			sender: {
				id: senderId
			},
			recipient: {
				id: recipientId
			},
			message: {
				text: "[Bot] " + receivedMsg
			}
		}
	});
}

function sendCommentReply(from, commentId, message) {
   request({
      uri: 'https://graph.facebook.com/v2.12/' + commentId + '/private_replies',
      qs: {
         access_token: VERIFY_TOKEN
      },
      method: 'POST',
      json: {
         // sender: {
         //    id: from.id
         // },
         // recipient: {
         //    id: from.id
         // },
         message: 'Hello' + from.name + '! Wellcome my page.'
      }
   });
}
