//require all dependencies
const express = require('express');
require('dotenv').config()
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const app = express();
var PORT = process.env.PORT || 3001;
app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});

app.get("/notes", (req, res) => {
   res.sendFile(path.join(__dirname, "./public/notes.html"))
});

app.get("/api/notes", async (req, res) => {
    let response;
    try{
        const readDBFile = await fs.readFile("./db/db.json", 'utf8');
        response = JSON.parse(readDBFile);
    }catch(err){
        console.log("Unable to open the file")
        response = [];
    }

    return res.json(response);
});


app.post("/api/notes", async (req, res) => {
    const currentNote = req.body;
    currentNote["id"] = uuidv4();
    const readDBFile = await fs.readFile("./db/db.json", 'utf8');
    let notes = JSON.parse(readDBFile);
    notes.push(currentNote)
    await fs.writeFile('./db/db.json', JSON.stringify(notes), 'utf8');

    return res.json(notes);
});

app.delete("/api/notes/:noteId", async (req, res) => {
    const noteId = req.params.noteId;
    let response;
    try{
        const readDBFile = await fs.readFile("./db/db.json", 'utf8');
        let notes = JSON.parse(readDBFile);
        const updatedNotes = notes.filter(note => {
            if(note.id != noteId){
                return true;
            }
            return false;
        })
        await fs.writeFile('./db/db.json', JSON.stringify(updatedNotes), 'utf8');
    }catch(err){
        console.log("Unable to open the file")
        response = [];
    }

});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));