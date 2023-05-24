const express = require('express');
const path = require("path");
const fs = require('fs');

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

function assignID(notes){
  let maxID = -1;
  notes.forEach(note => {
    try{if(note.id > maxID){maxID = note.id;}}
    catch(err){console.error(err);}
  });
  return ++maxID;
}

//////////////////////////////////////////////////////////////////////////////////////////////


// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', (req, res) => {res.sendFile(path.join(__dirname, '/db/db.json'));console.info('Done got the GET');});

app.post('/api/notes', (req, res) => {

  console.info(`${req.method} request received`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title) {

    // Obtain existing
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const allNotes = JSON.parse(data);

        // Variable for the object we will save
        const note = {
          title,
          text,
          id:assignID(allNotes)
        };

        // Add a new review
        allNotes.push(note);

        // Write updated reviews back to the file
        fs.writeFile('./db/db.json',JSON.stringify(allNotes),(writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Notes updated.')
        );
      }
    });

    res.send('note.');
  } else {
    res.send('no note.');
  }
});

app.delete('/api/notes/:id', (req, res) => {

  console.info(`${req.method} request received`);

  const delid = parseInt(req.params.id);

  // If all the required properties are present
  if (delid) {

    // Obtain existing
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const allNotes = JSON.parse(data);
        let newNotes = [];

        allNotes.forEach(note => {if(note.id != delid){newNotes.push(note);}});

        // Write updated reviews back to the file
        fs.writeFile('./db/db.json',JSON.stringify(newNotes),(writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Notes updated.')
        );
      }
    });

    res.send('no note.');
  } else {
    console.info('N/A')
    res.send('still note.');
  }
});


app.listen(PORT, () =>
  console.log(`http://localhost:${PORT}`)
);