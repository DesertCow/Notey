//
//
// npm i uuid


//* Import express
const express = require('express');

//* Import Path
const path = require('path');

//* Import 'terms.json' file
const noteDatabase = require('../../../db/db.json')

//* Import Random ID
const { v4: uuidv4 } = require('uuid');

// Generate RANDOM ID
console.log("RANDOM = " + uuidv4()); //




//* Initialize app variable
const app = express();
const PORT = 3001;

//* http://localhost:3001/ will return the content of our `terms.json` file


//? ================= Route: /notes =================
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '../../../db/db.json'))
);

app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '../../../db/db.json'))
);

//? ================= Route: * =================
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '../../index.html'))
);


app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);