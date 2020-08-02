// const fs = require('fs');
// const path = require('path');

const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

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

app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// direction to access public folder data
app.use(express.static('public'));

// Setting up the server: listen for requests
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});


