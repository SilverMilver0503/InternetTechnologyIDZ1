const canvas = document.getElementById("rootCanvas");
const ctx = canvas.getContext("2d");

const socket = io();

let radius = 10; // пікселів
let color = "rgb(0, 0, 0)"
let prevX = -1;
let prevY = -1;

ctx.lineCap = "round"

let isMouseDown = false;

socket.emit('wannaImage');

  canvas.addEventListener('mousedown', function(event) {

    isMouseDown = true;

    var x = event.offsetX;
    var y = event.offsetY;

    socket.emit('dotToFriends', {x : x, y : y, color : color, radius : radius});

  });
  
  canvas.addEventListener('mouseup', function(event) {
    isMouseDown = false;
    prevX = -1;
    prevY = -1;
  });

  canvas.addEventListener('mousemove', function(event) {
    if (isMouseDown) {
        var x = event.offsetX;
        var y = event.offsetY;

        if(prevX > 0 && prevY > 0){
            
            

            socket.emit('darawToFriends', {fromX : prevX, toX : x, fromY : prevY, toY : y, color : color, radius : radius});
        };
        

        

        prevX = x;
        prevY = y;
    }
  });

  document.getElementById('radiusRange').addEventListener('input', function(event) {
    let value = event.target.value;
    document.getElementById('radiusNumber').value = value

    radius = value;
  });

  document.getElementById('radiusNumber').addEventListener('input', function(event) {
    let value = event.target.value;
    document.getElementById('radiusRange').value = value

    radius = value;
  });

  document.getElementById('color').addEventListener('input', function(event) {
    let value = event.target.value;

    color = value;
  });


  socket.on('redraw', (context) => {

    ctx.lineWidth = context.radius;
    ctx.strokeStyle = context.color;
    ctx.beginPath();
    ctx.moveTo(context.fromX, context.fromY);
    ctx.lineTo(context.toX, context.toY);
    ctx.stroke();


  });

  socket.on('dotdraw', (context) => {

    ctx.beginPath();
    ctx.arc(context.x, context.y, context.radius/2, 0, 2 * Math.PI, false);
    ctx.fillStyle = context.color;
    ctx.fill();


  });

  socket.on('redrawAll', (imageSrc) => {

    const image = new Image();
    image.src = imageSrc;

    image.onload = function() {
        // Зображення завантажено, ви можете виконати дії з ним
        // Наприклад, додати його до DOM або відобразити на <canvas>
        ctx.drawImage(image, 0, 0);
      };

    console.log('allRedrawed')

  });