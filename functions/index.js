const functions = require('firebase-functions');


exports.zenMaster = functions.https.onRequest((request, response) => {
 response.send("Hello from Zen Master!");
});
