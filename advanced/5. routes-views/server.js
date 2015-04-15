var express = require('express'),
    fs = require('fs'),
    http = require('http'),
    notes = [],
    bodyParser = require('body-parser');

try {
    notes = JSON.parse(fs.readFileSync('data/notes.json').toString());
} catch (error) {
    console.error('There was an error reading the file.\n' + error.message + '\nServer stopped.');
    process.exit(1);
}

var app, server;

app = express();

/* Configure Express */
app.set('port', 3000);
//app.use(express.bodyParser());

// Any HTTP request will be satisfied using the content under './client'
app.use(express.static('./client'));
app.use(bodyParser());

app.get('/data/notes/:id?', function (req, res) {
    var id = req.params.id;

    if (id) { // if has id, send note by id
        res.send(notes[id], 200);
    } else { // else send all the notes
        res.send(notes, 200);
    }
});

app.post('/data/notes', function (req, res) {
    var note = req.body;

    note.id = notes.length; // set id
    notes.push(note); // add note to collection

    res.send(note, 200); // send the note back
});

app.put('/data/notes/:id', function (req, res) {
    var id = req.params.id,
        note = req.body;

    notes[id] = note;

    res.send(note, 200); // send the note back
});

/* Route: all others go to the defult client webapp for now */
app.get('*', function (req, res) {
    res.sendfile('./client/index.html');
});

server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});