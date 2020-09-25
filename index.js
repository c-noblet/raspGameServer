
const { exec } = require("child_process");
let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
var mqtt = require('mqtt');
let path = require('path');
let express = require('express');

var mosquitto = mqtt.connect('mqtt://localhost:1883');

app.use(express.static(path.join(__dirname, '/www')));

//Get page d'accueil
app.get('/', (req, res) => {
    res.sendFile(__dirname+'/www/index.html');
});
app.get('/specs', (req, res) => {

    exec("scrot "+__dirname+"/www/specs/image.png", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
    }
 res.sendFile(__dirname+'/www/specs/image.png');
});

});


io.on('connection', (socket) => {
    console.log('web connected');

    socket.on('subscribe', function (data) {
        socket.join(data.topic);
        mosquitto.subscribe(data.topic);
        console.log('Subscribing to '+data.topic);
    });

    socket.on('publish', function (data) {
        mosquitto.publish(data.topic,data.payload);
        console.log('Publishing to '+data.topic);
    });
})

mosquitto.on('connect', function () {
    mosquitto.subscribe('manette', function (err) {
        console.log('raspberry->manette');
    });
    mosquitto.subscribe('gamedata', function (err) {
	console.log('client->client');
    })
  })

mosquitto.on('message', function (topic, message) {
    console.log(topic+'='+message.toString());
    io.to(topic).emit(topic, {
        'topic':String(topic),
        'message':String(message)
    });
    //mosquitto.end();
});

http.listen(3000, () => {
    console.log('listening on *:3000');
})

