//
//
// npm i uuid


//* Import express
const express = require('express');

const fs = require('fs');
let appendFlag = 'w';

fs.writeFile(`./db/db.json`, '{ }', { 'flag': appendFlag }, (err) =>
  err
    ? console.error(err)
    : console.log(
      `Database Has Been Cleared, Fresh JSON generated.`
    )
);


//* Import Path
const path = require('path');

//* Import 'terms.json' file
// const noteDatabase = require('./db/db.json')
// const noteAdd = require('./public/notes.html')


//* Import Random ID/
const { v4: uuidv4 } = require('uuid');

// Generate RANDOM ID
console.log("RANDOM = " + uuidv4()); //


//* Initialize app variable
const PORT = 3001;
const app = express();

//* ###### Boilerplate URL Encoded Handler
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/public', express.static(path.join(__dirname, '/public')));


//? ================= Route: /notes =================
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
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
      note_id: uuidv4(),
    };

    const response = {
      status: 'success',
      body: newNote,
    };

    const noteString = JSON.stringify(newNote);



    fs.writeFile(`./db/db.json`, noteString, { 'flag': appendFlag }, (err) => {

      if (err) {
        console.error(err)
      }

    });

    appendFlag = 'a';

    console.log(response);

    //* ###### Return a "VALID" respone in the form of JSON to client
    res.status(201).json(response);
  } else {
    //* ###### If request fails then return Error to client via JSON format
    res.status(500).json('[POST] Request Failed!');
  }
});

//! ================= Post: /api/delete/:note_id =================
app.delete('/api/delete/:note_id', (req, res) => {
  // res.sendFile(path.join(__dirname, './public/index.html'))
  console.log("User has tried to delete a post!" + req.params.note_id);

  const removePostID = req.params.note_id;

  if (removePostID) {

    let delKey = removePostID;

    console.log("Delete Key = " + delKey);

    // TODO: Add code that searches and deletes entire element from Database matching delKey

    res.status(201).json(response);
  } else {
    res.status(500).json('[DELETE] Request Failed!');
  }

}
);


app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);