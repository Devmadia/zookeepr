const fs = require("fs");
const path = require("path");

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
      console.log(personalityTraitsArray);
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
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
    path.join(__dirname, '../data/animals.json'),
    JSON.stringify({ animals: animalsArray }, null, 2)
);
return animal;
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

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};