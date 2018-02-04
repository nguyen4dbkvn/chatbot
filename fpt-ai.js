'use strict';

const request = require('request');

const FPT_AI_HOST = "https://api.fpt.ai/v1";
const APP_TOKEN = "vR0FRtb1Jw98RwNwZYGxJRbASJD3nQuF";

function listIntent(callback) {
   get(FPT_AI_HOST + '/intents', callback);
}

function createIntent(label, description, callback) {
   var data = {
      "label": label,
      "description": description
   };

   post(FPT_AI_HOST + '/intents', data, callback);
}

function getIntent(label, callback) {

   get(FPT_AI_HOST + '/intents/' + label, callback);
}

function deleteIntent(label, callback) {
   del(FPT_AI_HOST + '/intents/' + label, callback);
}

function updateIntent(description, callback) {
   var data = {"description": description};

   put(FPT_AI_HOST + '/intents/' + label, data, callback);
}

function listEntity(callback) {
   get(FPT_AI_HOST + '/entities', callback);
}

function createEntity(label, description, callback) {
   var data = {
      "label": label,
      "description": description
   };

   post(FPT_AI_HOST + '/entities', data, callback);
}

function getEntity(label, callback) {

   get(FPT_AI_HOST + '/entities/' + label, callback);
}

function deleteEntity(label, callback) {
   del(FPT_AI_HOST + '/entities/' + label, callback);
}

function updateEntity(description, callback) {
   var data = {"description": description};

   put(FPT_AI_HOST + '/entities/' + label, data, callback);
}

function getDateTime(content, callback) {
   var data = {
      "content": content,
      "language": "vi"
   }

   post(FPT_AI_HOST + '/recognize', data, callback);
}

function get(url, callback) {
   request({
      url: url,
      headers: {
         "Authorization": "Bearer " + APP_TOKEN,
         'Content-Type': 'application/json'
      },
      method: 'GET'
   }, function (err, res, body) {
      callback(err, res, body);
   });
}

function post(url, form, callback) {
   request({
      url: url,
      headers: {
         "Authorization": "Bearer " + APP_TOKEN,
         'Content-Type': 'application/json'
      },
      method: 'POST',
      form: form
   }, function (err, res, body) {
      callback(err, res, body);
   });
}

function del(url, callback) {
   request({
      url: url,
      headers: {
         "Authorization": "Bearer " + APP_TOKEN,
         'Content-Type': 'application/json'
      },
      method: 'DELETE'
   }, function (err, res, body) {
      callback(err, res, body);
   });
}

function put(url, data, callback) {
   request({
      url: url,
      headers: {
         "Authorization": "Bearer " + APP_TOKEN,
         'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: data
   }, function (err, res, body) {
      callback(err, res, body);
   });
}

module.exports = {
   listIntent: listIntent,
   getDateTime: getDateTime
}
