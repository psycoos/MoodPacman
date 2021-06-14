var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var server = http.createServer(app);    
var fs = require('fs'); 

const { Server } = require("socket.io");
const io = new Server(server);

var mooddata = 0;


var myLogger = function (req, res, next) {
    console.log('GET ' + req.path)
    next()
}



app.use(myLogger);
app.use(express.static('.'))


// viewed at http://localhost:8080
app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname + '/index.htm'));

});

var PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log('Server started at http://localhost:' + PORT));

//code for reading from serial port connections
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');const port = new SerialPort('/dev/cu.usbmodem14201', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));// Read the port data

port.on("open", () => {
  console.log('serial port open');
});

parser.on('data', data =>{
    // console.log('arduino says:', data);
    mooddata = data;
    console.log(mooddata);
    io.emit('mood', mooddata);
    fs.appendFile('GSRdata.txt', mooddata, function (err) {
        if (err) throw err;
    }); 
});

server.listen(3000, () => {
    console.log('peepeepoopoo');
    io.emit('mood', mooddata);
  });

io.on('connection', (socket) => {
    console.log('a user connected');
    // socket.on("ping", (mooddata) => {
    //     io.emit('mood', mooddata);
    //   });

    fs.writeFile('GSRdata.txt', '', function (err) {
        if (err) throw err;
        console.log('Saved!');
    }); 
    fs.appendFile('GSRdata.txt', `${Date.now()} \n`, function (err) {
        if (err) throw err;
    });   
});









