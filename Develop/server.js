//
//
// npm i uuid


//* Import express
const express = require('express');

//* Import Path
const path = require('path');

//* Import 'terms.json' file
const noteDatabase = require('./db/db.json')

//* Import Random ID
const { v4: uuidv4 } = require('uuid');

// Generate RANDOM ID
console.log("RANDOM = " + uuidv4()); //


//* Initialize app variable
const PORT = 3001;
const app = express();

//* ###### Boilerplate URL Encoded Handler
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//* http://localhost:3001/ will return the content of our `terms.json` file


//? ================= Route: /notes =================
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './db/db.json'))
);

app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './db/db.json'))
);

//? ================= Route: * =================
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);


//! ================= Post: /api/notes =================
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a review`);

  //* ######  extracts the data from JSON passed with Request
  const { title, text } = req.body;

  //* ######  Confrim valid data exists for all fields
  if (title && text) {

    // Variable for the object we will save
    const newNote = {
      title,
      text,
      review_id: uuidv4(),
    };

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);

    //* ###### Return a "VALID" respone in the form of JSON to client
    res.status(201).json(response);
  } else {
    //* ###### If request fails then return Error to client via JSON format
    res.status(500).json('Error in posting review');
  }
});


app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);