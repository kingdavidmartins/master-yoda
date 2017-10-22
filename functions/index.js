// debug
process.env.DEBUG = 'actions-on-google:*';

// require necessary libs
const functions = require('firebase-functions');
const fs = require('fs');
const App = require('actions-on-google').ApiAiApp;

// read & modify file to my format
const quoteSet1 = JSON
                    .parse(fs.readFileSync(__dirname + '/quotesJSON.txt', 'utf8'))
                    .map(quote => quote.quoteText);

// read & modify file to my format
const quoteSet2 = fs.readFileSync(__dirname + '/quotesJSON2.txt', 'utf8')
                    .trim()
                    .split('\n')
                    .map(x => JSON.parse(x)[0]);

// read & modify file to my format
const quoteSet3 = fs.readFileSync(__dirname + '/quotesJSON3.txt', 'utf8')
                    .trim()
                    .split('\n')
                    .map(quote => quote.slice(1, -3));

// init newQuoteSet so I can push new quote files if needed
let newQuoteSet = [];

// push quotes from quoteSet1 to newQuoteSet
newQuoteSet.push(...quoteSet1);

// push quotes from quoteSet2 to newQuoteSet
newQuoteSet.push(...quoteSet2);

// push quotes from quoteSet3 to newQuoteSet
newQuoteSet.push(...quoteSet3);

const generateQuote = () => {

  let statsWord = {};
  let initWords = [];
  let terminals = {};

  newQuoteSet
   .forEach((title) => {
     let words = title.split(' ');
     terminals[words[words.length - 1]] = true;
     initWords.push(words[0]);

     // creates a map of all the different words that are next
     words
       .forEach((_, index) =>
         (statsWord.hasOwnProperty(words[index]))
           ? statsWord[words[index]].push(words[index+1])
           : statsWord[words[index]] = [words[index+1]]);
   });

   // picks a random element from that array you pass in
   const selection = (a) => a[ Math.floor( a.length * Math.random() ) ];

   // function that make quote of x words from the mapped state + following word probability
   const make_quote = (min_length) => {

     // pick a random word to start the title from initWords
     word = selection(initWords);
     let title = [word];

     // loop as long as the selected word is probable and push to quote
     while (statsWord.hasOwnProperty(word)) {
       let next_words = statsWord[word];
       word = selection(next_words);
       title.push(word);

       // if length of title > min_length && if selected word exist in terminals break out
       if (title.length > min_length && terminals.hasOwnProperty(word)) {
         break;
       }
     }

     if (title.length < min_length || title.length < 10) {
       return make_quote(min_length);
     }

     return title.join(' ');
   };

  let newTitle = make_quote(2 + Math.floor(1 * Math.random()));
  return newTitle;

}

exports.zenMaster = functions.https.onRequest((request, response) => {

 const app = new App({ request, response });

  // uncomment to log request.header & request.body
  // console.log('Request headers: ' + JSON.stringify(request.headers));
  // console.log('Request body: ' + JSON.stringify(request.body));

  // Say a quote
  let fallBack = (app) => {

      // Conversation repair is handled in API.AI, but this is a safeguard
      if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {

        app.ask(
          app
            .buildRichResponse()
            .addSimpleResponse(`<speak>Clear your mind you must. <break time="350ms"/> Teach you I shall. <break time="350ms"/> Meditate on this. <break time="350ms"/> You will. <break time="800ms"/> ${generateQuote()}. <break time="350ms"/> Mighty and strong you are. <break time="350ms"/> Believe in yourself you must. <break time="800ms"/> Honor life by living. <break time="350ms"/> Follow my words. <break time="350ms"/> Prosper.</speak>`)
            .addSimpleResponse(`<speak><break time="600ms"/> Anything else you seek? My Padawan! </speak>`));

      } else {
        app.ask(`<speak>Clear your mind you must. <break time="350ms"/> Teach you I shall. <break time="350ms"/> \
        Meditate on this. <break time="350ms"/> You will. <break time="800ms"/> ${generateQuote()}. \
        <break time="800ms"/>Honor life by living. <break time="350ms"/> Follow my words. <break time="350ms"/> Prosper. \
        <break time="600ms"/> Anything else you seek? My Padawan</speak>`);
      }

  }

  let actionMap = new Map();
  actionMap.set('input.unknown', fallBack);

  app.handleRequest(actionMap);

});
