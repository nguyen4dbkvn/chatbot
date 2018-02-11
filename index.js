'use strict';

const
   express = require('express'),
   request = require('request'),
   bodyParser = require('body-parser'),
   path = require('path'),
   app = express().use(bodyParser.json());

   app.use(bodyParser.urlencoded({extended: false}));

// let VERIFY_TOKEN = "EAAEOCh2yDjwBAKLdOw21Rf132ck5V7jsWLiTHxZBBj9u4b5aH8BTmHJdMXg2UW3VjkxiMJvovpWWwipMSDsVrgMn4o9Qe3hVKP8p2F1RjVxii1F2lgNOAAE6ZAQJo7QIZAIq2zZCUZA15qeouBIbRCths4HspgK3e35wrXh2lZBjMNDuIZAvyaU";
// let VERIFY_TOKEN = "EAAExEuqCQQYBAMCCfTGZCQ2MBYjjbTno3ZAOqDAP3EOVuLTsjayA1nDOPDZAdZAB6HZA48Yb3xUgCafeL8xO6ZA0HGjEkUJ1L2lSpKBw0GjhrZB1iuLDJgUjV0aPMlLkg4b2yunJCthyngbqnKrPsXV5miVdVrvMUmCGbII1FLsyu1DBSzdoycg"
//let VERIFY_TOKEN = "EAACEdEose0cBAKGjeWd4T9e43UMpBD8K5DdgwBesEMHKALFDuNaZAmYai50aA3XhoJALiY2uGFUJ7buAZBAE6soOIlhjiPPP1QUZAWMgVyZBGwBDEXOQZBNufeqBKCrt0n0q3wbQebuGbqOrEmWJVbPSX5a5LOvMkiqYmFGQZCZCHHdSH7XZCkUwQY5XZBRWKYUe51Ad05wiM0gZDZD"
let VERIFY_TOKEN = "335432290287878|g3wgooRtQfsD6A6x4W-GOOSCiU8";

let products = [{"id": "0001", "price": "200$"}, {"id": "0002", "price": "350$"}];

let PAGES = [{"pageId": "339555589884042", "name": "Đồng hồ abc"}, {"pageId": "171366526684972", "name": "LAIF0 FPT.AI"}]

let ACCESS_TOKEN;

app.listen(process.env.PORT || 4000, () => console.log('webhook is listening.'));

app.get('/', (req, res) => {
   /*var callback = function (err, res, body) {
      if (err) {
         console.error(err);
      }
      else {
         console.log(body);
      }
   }
   var content = req.query['content'];
   fptAI.getDateTime(content, callback);
   res.status(200).send('OK');*/

   res.sendFile(path.join(__dirname + '/html/index.html'));
});

app.post('/webhook', (req, res) => {
   let body = req.body;

   if (body.object === 'page') {
      body.entry.forEach(function (entry) {
         if (entry.hasOwnProperty('changes')) {
            entry.changes.forEach(function (changes) {
               // if (changes.field === 'feed' && changes.value.item)
               console.log(changes);

               let value = changes.value;

               if (value.from.name !== 'Đồng hồ abc' && !!ACCESS_TOKEN) {
                  sendCommentReply(value.from, value.comment_id, value.message);
                  sendPrivateReply(value.from, value.comment_id, value.message);
                  likeComment(value.comment_id);
               }
               else if (ACCESS_TOKEN === undefined || ACCESS_TOKEN === '') {
                  console.log("Not found access token!!!");
               }
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

app.post('/authorize', (req, res) => {
   let body = req.body;

   request({
      url: 'https://graph.facebook.com/me/accounts',
      qs: {
			access_token: body.accessToken,
         scope: 'manage_pages,publish_pages,read_page_mailboxes,pages_messaging,pages_messaging_subscriptions'
		},
      method: 'GET'
   }, function (error, response, body) {
      if (!error && response.statusCode == 200) {

         if (body.data.length > 0) {
            body.data.forEach(function (page) {
               if (page.id === PAGES[0].pageId) {
                  ACCESS_TOKEN = page.access_token;
               }
            });
         }
         console.log(body);
         console.log(ACCESS_TOKEN);
      } else {
         console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
      }
   });

   res.sendStatus(200);
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
      uri: 'https://graph.facebook.com/v2.12/' + commentId + '/comments',
      qs: {
         access_token: ACCESS_TOKEN
      },
      method: 'POST',
      json: {
         message: 'Cảm ơn bạn đã quan tâm đến sản phẩm. Bạn kiểm tra inbox giúp mình nhé.'
      }
   }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    } else {
      console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
    }
  });
}

function sendPrivateReply(from, commentId, message) {
   request({
      uri: 'https://graph.facebook.com/v2.12/' + commentId + '/private_replies',
      qs: {
         access_token: ACCESS_TOKEN
      },
      method: 'POST',
      json: {
         message: 'Cảm ơn bạn đã quan tâm đến sản phẩm có mã #' + products[0].id + '. Sản phẩm có giá ' + products[0].price
      }
   }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
         console.log(body);
      } else {
         console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
      }
   });
}

function likeComment(commentId) {
   request({
      uri: 'https://graph.facebook.com/v2.12/' + commentId + '/likes',
      qs: {
         access_token: ACCESS_TOKEN
      },
      method: 'POST'
   }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
         console.log(body);
      } else {
         console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
      }
   });
}
