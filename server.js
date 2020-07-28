const express = require('express'); // require Express.js

// Setting up the server: first step to instantiate the server
const app = express();

// Setting up the server: listen for requests
app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
  });