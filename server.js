const fs = require('fs');
const path = require('path');

const express = require('express'); // require Express.js
const { animals } = require('./data/animals'); // require animals.json

// set port for Heroku app to run through 3001 instead of default 80
const PORT = process.env.PORT || 3001;

// Setting up the server: first step to instantiate the server
const app = express();

//  instructs the server to make certain files readily available and to not gate it behind a server endpoint
app.use(express.static('public'));

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
  const animal = body;
  animalsArray.push(animal);

  // doesn't require a callback function
  fs.writeFileSync( 
    path.join(__dirname, './data/animals.json'),
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  return animal;
  
  // console.log(body);
  // // our function's main code will go here!

  // // return finished code to post route for response

  // const animal = body;
  // animalsArray.push(animal);

  // return animal;

  // return body;
}

//  take our new animal data from req.body and check if each key not only exists, but that it is also the right type of data
function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}

// set up a route on our server that accepts data to be used or stored server-side
app.post('/api/animals', (req, res) => {
  // req.body is where our incoming content will be
  // console.log(req.body);

  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.');
  } else {
  // add animal to json file and animals array in this function
  const animal = createNewAnimal(req.body, animals);

  res.json(req.body);
  }
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

// add a route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html')); // the route used to create a homepage for a server
});

// Setting up the server: listen for requests
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});

// hardcoded port to listen to requests
// app.listen(3001, () => {
//     console.log(`API server now on port 3001!`);
//   });

