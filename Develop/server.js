//
//
// npm i uuid
//

//! ================= Import Section =================
//* Import express
const express = require('express');

const fs = require('fs');
let appendFlag = 'w';

fs.writeFile(`./db/db.json`, '[{"title":"Welcome to Notey!","text":"Example Note Text","note_id":"ex1"},{"title":"Edit Your First Note!","text":"Example Note Text","note_id":"ex2"}]', { 'flag': appendFlag }, (err) =>
  err
    ? console.error(err)
    : console.log(
      `Database Has Been Cleared, Fresh JSON generated.`
    )
);

//* Import Path
const path = require('path');

//* Import Random ID/
const { v4: uuidv4 } = require('uuid');

//* Initialize app variable
const PORT = process.env.PORT || 3001;
const app = express();

//* ###### Boilerplate URL Encoded Handler
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* Serve static content from public directory
app.use('/public', express.static(path.join(__dirname, '/public')));

//! ======================= Routing =====================

//? ================= GET: /notes =================
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

//? ================= GET: /api/notes =================
app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './db/db.json'))
);

//? ================= GET: * =================
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

//? ================= POST: /api/notes =================
app.post('/api/notes', (req, res) => {

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

    fs.readFile(`./db/db.json`, 'utf-8', (err, noteString) => {

      noteString = JSON.parse(noteString);
      noteString.push(newNote);
      noteString = JSON.stringify(noteString);

      fs.writeFile(`./db/db.json`, noteString, err => err ? console.log(err) : null)
    })

    //* Set Flag for FS write from overwrite to append
    appendFlag = 'a';

    //* ###### Return a "VALID" respone in the form of JSON to client
    res.status(201).json(response);
  } else {
    //* ###### If request fails then return Error to client via JSON format
    res.status(500).json('[POST] Request Failed!');
  }
});


//? ================= POST: /api/delete/:note_id =================
app.delete('/api/delete/:note_id', (req, res) => {

  const removePostID = req.params.note_id;

  if (removePostID) {

    let delKey = removePostID;

    fs.readFile(`./db/db.json`, 'utf-8', (err, existingNotes) => {

      existingNotes = JSON.parse(existingNotes);

      for (let i = 0; i < existingNotes.length; i++) {


        if (existingNotes[i].note_id === delKey) {


          let response = {
            status: 'success',
            body: 'Delete Completed!',
          };

          existingNotes.splice(i, 1);

          i = 1 + existingNotes.length;
        }

      }

      existingNotes = JSON.stringify(existingNotes);

      fs.writeFile(`./db/db.json`, existingNotes, err => err ? console.log(err) : null)
      return res.json("Delete Successful Updated DB = " + existingNotes);

    })
    // if (res.status(201).json(response)) {
    //   if (res.status(201).json(response)) {
    //   } else {
    //     res.status(500).json('[DELETE] Request Failed!');
    //   }
    // }
  }
});


app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);



//! ======================= EOF =====================