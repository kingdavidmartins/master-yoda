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

// console.log(quoteSet3);

// init newQuoteSet so I can push new quote files if needed
let newQuoteSet = [];

// push quotes from quoteSet1 to newQuoteSet
quoteSet1
  .forEach(quote => newQuoteSet.push(quote));

// push quotes from quoteSet2 to newQuoteSet
quoteSet2
  .forEach(quote => newQuoteSet.push(quote));

// push quotes from quoteSet3 to newQuoteSet
quoteSet3
  .forEach(quote => newQuoteSet.push(quote));

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

     if (title.length < min_length) {
       return make_quote(min_length);
     }

     return title.join(' ');
   };

  let newTitle = make_quote(2 + Math.floor(1 * Math.random()));
  return newTitle;

}
console.log(generateQuote());
exports.zenMaster = functions.https.onRequest((request, response) => {

 const app = new App({ request, response });

  // uncomment to log request.header & request.body
  // console.log('Request headers: ' + JSON.stringify(request.headers));
  // console.log('Request body: ' + JSON.stringify(request.body));

  // Say a quote
  function fallBack (app) {

      // Conversation repair is handled in API.AI, but this is a safeguard
      if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {

        app.ask(
          app
            .buildRichResponse()
            .addSimpleResponse('Clear your mind you must. Teach you I shall. Meditate on this. You will. '+ generateQuote()));
      } else {
        app.ask('Clear your mind you must. Teach you I shall. Meditate on this. You will. '+ generateQuote());
      }

  }

  let actionMap = new Map();
  actionMap.set('input.unknown', fallBack);

  app.handleRequest(actionMap);

});
