
const experess = require('express')
//const fs = require('fs')
const path = require('path')
const app = experess();
const { createCanvas, loadImage } = require('canvas');


app.use(experess.static(__dirname))

var http = require('http').Server(app);
var io = require('socket.io')(http);

let globalCanvas = createCanvas(1400, 1400);
let globalContext = globalCanvas.getContext('2d');

globalContext.fillStyle = 'white';
globalContext.fillRect(0, 0, 1400, 1400);

globalContext.lineCap = "round"

function logIPByReq(req){

    if (req.ip) {
        console.log(`IP address is: ${req.ip}`);
      } else {
        console.log('IP address is undefined');
    }

}

function logIPBySocker(socket){

    const clientIP = socket.handshake.address;
    console.log('IP address is:', clientIP);

}

app.get('/', function(req, res){

    res.redirect('/home')

})

app.get('/home', function(req, res){

    console.log('Hello GET home')

    logIPByReq(req)

    const filePath = path.normalize(path.join( __dirname, "Main.html"));

    res.sendFile(filePath)

})

io.on('connection', function(socket){

    console.log('User connected to socket');
    logIPBySocker(socket);

    socket.on('darawToFriends', function(ctx){

        globalContext.lineWidth = ctx.radius;
        globalContext.strokeStyle = ctx.color;
        globalContext.beginPath();
        globalContext.moveTo(ctx.fromX, ctx.fromY);
        globalContext.lineTo(ctx.toX, ctx.toY);
        globalContext.stroke();

        io.emit('redraw', ctx);

    });
    socket.on('dotToFriends', function(ctx){

        globalContext.beginPath();
        globalContext.arc(ctx.x, ctx.y, ctx.radius/2, 0, 2 * Math.PI, false);
        globalContext.fillStyle = ctx.color;
        globalContext.fill();


        io.emit('dotdraw', ctx);

    });
    socket.on('wannaImage', function(){

        io.emit('redrawAll', globalCanvas.toDataURL());        
    });

  
})

http.listen(3002, function(){

    console.log(__dirname)

    console.log('Hello LISTEN')

})

