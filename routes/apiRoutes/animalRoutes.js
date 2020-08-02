const router = require('express').Router();
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');

// GET route
router.get('/animals', (req, res) => {
    let results = animals;
    if (req.query) {
    results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// new (param) GET route for animals by ID
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);  // param route must come after GET routes
    if (result) {
        res.json(result);
    } else {
        res.sendStatus(404); // 404 status code is meant to communicate to the client that the requested resource could not be found
    }
});

// set up a route on our server that accepts data to be used or stored server-side
router.post('/animals', (req, res) => {
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


module.exports  = router;