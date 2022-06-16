//
//
// npm i uuid
// npm cheerio


//* Import express
const express = require('express');

const fs = require('fs');
let appendFlag = 'w';

fs.writeFile(`./db/db.json`, '[{"title":"Example Note","text":"Please Add Note Text","note_id":"1"},{"title":"Example Note 2","text":"Please Add Note Text","note_id":"2"}]', { 'flag': appendFlag }, (err) =>
  err
    ? console.error(err)
    : console.log(
      `Database Has Been Cleared, Fresh JSON generated.`
    )
);

// var beerCardBeerTitleEL = document.querySelector(".beerCardBeerTitle");
// const createNewNoteCard = require('./store');

const cheerio = require('cheerio');

const notesHTMLPath = __dirname + './public/notes.html';

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
const PORT = process.env.PORT || 3001;
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
  console.info(`${req.method} request received to add a new note`);

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

    createNewNoteCard(title, text);


    fs.readFile(`./db/db.json`, 'utf-8', (err, noteString) => {

      noteString = JSON.parse(noteString);
      noteString.push(newNote);
      noteString = JSON.stringify(noteString);

      fs.writeFile(`./db/db.json`, noteString, err => err ? console.log(err) : null)
    })



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

    fs.readFile(`./db/db.json`, 'utf-8', (err, existingNotes) => {

      existingNotes = JSON.parse(existingNotes);

      // noteString.push(newNote);

      // function searchKey(key) {
      //   return key.name === 'cherries';
      // }

      console.log("Exisiting Notes Count: " + existingNotes.length);



      for (let i = 0; i < existingNotes.length; i++) {

        console.log("Curernt Note ID " + i + " || " + existingNotes[i].note_id + " || " + existingNotes[i].text)

        if (existingNotes[i].note_id === delKey) {

          console.log("Key MATCH DELETE!");

          let response = {
            status: 'success',
            body: 'Delete Completed!',
          };

          existingNotes.splice(i, 1);

          i = 1 + existingNotes.length;
        }

      }
      //console.log("FIND =" + existingNotes.find(delKey));
      // console.log("NOTES = " + existingNotes);

      existingNotes = JSON.stringify(existingNotes);

      // fs.writeFile(`./db/db_after.json`, existingNotes, err => err ? console.log(err) : null)
      fs.writeFile(`./db/db.json`, existingNotes, err => err ? console.log(err) : null)
      return res.json(existingNotes);

    })
    // if (res.status(201).json(response)) {
    //   if (res.status(201).json(response)) {
    //   } else {
    //     res.status(500).json('[DELETE] Request Failed!');
    //   }
    // }
  }
});

function createNewNoteCard(title, text) {

  console.log("Title/Text = " + title + " // " + text);


  // const $ = cheerio.load('<h2 class="title">Hello world</h2>');
  // const $ = cheerio.load(notesHTMLPath);
  //   const $ = cheerio.load('../public/notes.html');

  //   const noteCardDiv = $('.list-group');

  //   console.log("Path = " + notesHTMLPath);
  //   console.log(noteCardDiv.html());
  //   console.log(noteCardDiv.text());

  //   $.root().html();
}


app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

