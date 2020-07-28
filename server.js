const fs = require('fs');
const path = require('path');

const express = require('express'); // require Express.js
const { animals } = require('./data/animals'); // require animals.json

// set port for Heroku app to run through 3001 instead of default 80
const PORT = process.env.PORT || 3001;

// Setting up the server: first step to instantiate the server
const app = express();


// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

/*  instead of handling the filter functionality inside 
the .get() callback, we're going to break it out into its own function. 
This will keep our code maintainable and clean*/

// function filterByQuery(query, animalsArray) {
//     let filteredResults = animalsArray;
//     if (query.diet) {
//       filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
//     }
//     if (query.species) {
//       filteredResults = filteredResults.filter(animal => animal.species === query.species);
//     }
//     if (query.name) {
//       filteredResults = filteredResults.filter(animal => animal.name === query.name);
//     }
//     return filteredResults;
// }

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
      // Save personalityTraits as a dedicated array.
      // If personalityTraits is a string, place it into a new array and save.
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
      } else {
        personalityTraitsArray = query.personalityTraits;
      }
      // Loop through each trait in the personalityTraits array:
      personalityTraitsArray.forEach(trait => {
        // Check the trait against each animal in the filteredResults array.
        // Remember, it is initially a copy of the animalsArray,
        // but here we're updating it for each trait in the .forEach() loop.
        // For each trait being targeted by the filter, the filteredResults
        // array will then contain only the entries that contain the trait,
        // so at the end we'll have an array of animals that have every one 
        // of the traits when the .forEach() loop is finished.
        filteredResults = filteredResults.filter(
          animal => animal.personalityTraits.indexOf(trait) !== -1
        );
      });
    }
    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
  }

// To add the route for requiring animals.json
/* a string that describes the route the client 
will have to fetch from & a callback function that will execute every time that route is accessed with a GET request */
// app.get('/api/animals', (req, res) => { 
//     // using the send() method from the res parameter (short for response) to send the string Hello!
//     // res.send('Hello!');
//     // res.json(animals); // this will display the contents of the animals.json file in the browser


//     let results = animals;
//     console.log(req.query) // accessing the query property on the req object
//     res.json(results);
//   });

/* This function will take in req.query as an argument and 
filter through the animals accordingly, returning the new filtered array*/

//  takes in the id and array of animals and returns a single animal object
function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}

// to create a separate function to handle taking the data from req.body and adding it to our animals.json file
function createNewAnimal(body, animalsArray) {
  console.log(body);
  // our function's main code will go here!

  // return finished code to post route for response

  const animal = body;
  animalsArray.push(animal);

  return animal;

  // return body;
}

// set up a route on our server that accepts data to be used or stored server-side
app.post('/api/animals', (req, res) => {
  // req.body is where our incoming content will be
  // console.log(req.body);

  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  // add animal to json file and animals array in this function
  const animal = createNewAnimal(req.body, animals);

  res.json(req.body);
});

// GET route
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// new (param) GET route for animals by ID
app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);  // param route must come after GET routes
  if (result) {
    res.json(result);
  } else {
    res.sendStatus(404); // 404 status code is meant to communicate to the client that the requested resource could not be found
  }
});

// Setting up the server: listen for requests
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});

// hardcoded port to listen to requests
// app.listen(3001, () => {
//     console.log(`API server now on port 3001!`);
//   });

