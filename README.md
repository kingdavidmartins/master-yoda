# Master Yoda ~ Google Assistant

## *Api.ai + Actions on Google | SDK + Markov Chains = Master Yoda*

<!-- ### *Goal*

My goal was to create a movie title generator that could generate unique movie title's based on a given genre that seemed highly probably when compared to actual move titles. -->


<!-- ### *Game Plan*

My plan was to use a mathematical structure called Markov chain's to model the statistical likelihood of a word in a title being followed by some other word in a title. Then, I could use that statistical information to generate new titles by choosing the first word (at random) and then choosing subsequent words with a frequency proportional to how those words, and how they are arranged in regards to the original title. This will then give me a string of text that will not only be unique, but will also share stylistic properties when compared to the original text. -->


<!-- ### *Why?*

I'm interested in learning more about Markov Chains & Hidden Markov Models because I would like to explore the following concepts.
 - Automatic Speech Recognition
 - Navigation Prediction & Transitions.

Which use and/or implement Markov Models one way or another -->


<!-- ### *Result*

My results suggest that generate.js was able to effectively model and observe the created state using Markov Chains, which then made it possible for the system to get the probability of each word and it's successor fairly easily. Thus making sentence/title generation from large datasets accurate and efficient. -->

#### *Example*

User: 'Ok Google speak to Master Yoda'

Master Yoda: 'Help you I shall. Enlighten you I will. What troubles you my little padawan?'

User: 'Any advice master? I don't know what to do'

Master Yoda: 'Clear your mind you must. Teach you I shall. Meditate on this. You will. It is to say, and Virtue is sure there quickly. Do not lose your motivation because your job didn't last. Well, there's nothing you can do.. Mighty and strong you are. Believe in yourself you must. Honor life by living. Follow my words. Prosper.'

User: 'Thank you, means alot. Talk to you later'

Master Yoda: 'Fearless and relentless you shall become. Wise and honest I am. See you again I shall.'

### *Next Steps*

This Assistant can be developed further in a number of ways.

- I would like to use some other statistical model that is more accurate to generate more coherent and dependable response's that can help engage users.

- I would also want to train the Assistant to learn how to discern the users state in regards to how they are feeling in the moment based on how they're asking for advice. So it can generate advice that's more empathic towards users
