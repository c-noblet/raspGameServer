// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback ){
            return setTimeout(() => {  callback; }, 1000 / 60);
            // return window.setTimeout(callback, 1000 / 60);
        };
})();

window.cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame          ||
        window.webkitCancelRequestAnimationFrame    ||
        window.mozCancelRequestAnimationFrame       ||
        window.oCancelRequestAnimationFrame     ||
        window.msCancelRequestAnimationFrame        ||
        clearTimeout
} )();


// Connexion au raspberry PI
var socket = io.connect('192.168.43.54:3000');
    socket.on('connect', function() {
        console.log('connect');
        socket.on('manette', function(msg) {
        	let input = JSON.parse(msg.message);
            
            if(!clickToStart)
              startButton(input);
            else
	      movePad(input); 
        });
    });
    $(document).ready(function (){
        socket.emit('subscribe', {topic:'manette'});
    });

// Initialize canvas and required variables
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"), // Create canvas context
    W = window.innerWidth, // Window's width
    H = window.innerHeight, // Window's height
    particles = [], // Array containing particles
    ball = {}, // Ball object
    paddles = [2], // Array containing two paddles
    paddleVx = 10,
    mouse = {}, // Mouse object to store it's current position
    points = 0, // Varialbe to store points
    score1 = 0,
    score2 = 0,
    fps = 60, // Max FPS (frames per second)
    particlesCount = 20, // Number of sparks when ball strikes the paddle
    flag = 0, // Flag variable which is changed on collision
    particlePos = {}, // Object to contain the position of collision
    multiplier = 1, // Varialbe to control the direction of sparks
    startBtn = {}, // Start button object
    restartBtn = {}, // Restart button object
    over = 0, // flag varialbe, cahnged when the game is over
    init, // variable to initialize animation
    clickToStart = false,
    paddleHit

// Add mousemove and mousedown events to the canvas
canvas.addEventListener("mousemove", trackPosition, true);
// canvas.addEventListener("mousedown", btnClick, true);

// Initialise the collision sound
collision = document.getElementById("collide");

// Set the canvas's height and width to full screen
canvas.width = W;
canvas.height = H;

// Function to paint canvas
function paintCanvas() {
    ctx.fillStyle = "#4169E1";
    ctx.fillRect(0, 0, W, H);

    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.setLineDash([15, 5]);
    ctx.moveTo(0, H/2);
    ctx.lineTo(W, H/2);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    ctx.stroke();

    // ctx.beginPath();
    // ctx.fillStyle = 'white';
    // ctx.setLineDash([]);
    // ctx.moveTo(W/2, 0);
    // ctx.lineTo(W/2, H);
    // ctx.strokeStyle = 'white';
    // ctx.stroke();

}

// Function for creating paddles
function Paddle(pos) {
    // Height and width
    this.h = 12;
    this.w = 150;

    this.left = false;
    this.right = false;

    // Paddle's position
    this.x = W/2 - this.w/2;
    this.y = (pos == "right") ? 0 : H - this.h;

}

// Push two new paddles into the paddles[] array
paddles.push(new Paddle("left"));
paddles.push(new Paddle("right"));

// Ball object
ball = {
    x: 50,
    y: 50,
    r: 5,
    c: "white",
    vx: 4,
    vy: 8,

    // Function for drawing ball on canvas
    draw: function() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
        ctx.fill();
    }
};


// Start Button object
startBtn = {
    w: 250,
    h: 50,
    x: W/2 - 125,
    y: H/2 - 25,

    draw: function() {
        ctx.setLineDash([]);
        ctx.fillRect(this.x, this.y, this.w, this.h);


        ctx.font = "18px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#0055AB";
        ctx.fillText("Appuyez pour commencer", W/2, H/2 );
    }
};

// Restart Button object
restartBtn = {
    w: 100,
    h: 50,
    x: W/2 - 50,
    y: H/2 - 50,

    draw: function() {
        ctx.strokeStyle = "green";
        ctx.lineWidth = "2";
        ctx.strokeRect(this.x, this.y, this.w, this.h);

        ctx.font = "18px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStlye = "white";
        ctx.fillText("Restart", W/2, H/2 - 25 );
    }
};

// score affiché apres chaque point
scorePause = {
    draw: function() {
        ctx.font = "48px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStlye = "white";
        ctx.fillText(score1 + " - " + score2, W/2, H/2 - 25 );
    }
}

// score affiché a la fin
endScore = {
    draw: function(joueur) {
        ctx.font = "32px Cambria bold, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStlye = "white";
        ctx.fillText(joueur + " a gagné", W/2, 3*H/4 );
    }


}

/*quitBtn = {
    draw: function() {
        var img = document.getElementById("cross");
        ctx.drawImage(img,W-60,10, 50,50);
    }
}*/

// Function for creating particles object
function createParticles(x, y, m) {
    this.x = x || 0;
    this.y = y || 0;

    this.radius = 1.2;

    this.vx = -1.5 + Math.random()*3;
    this.vy = m * Math.random()*1.5;
}

// Draw everything on canvas
function draw() {
    paintCanvas();
    for(var i = 0; i < paddles.length; i++) {
        p = paddles[i];

        if(i==1){
            ctx.fillStyle = "red";
            ctx.fillRect(p.x, p.y, p.w, p.h);
        }
        if(i==2){
            ctx.fillStyle = "black";
            ctx.fillRect(p.x, p.y, p.w, p.h);
        }

        
    }

    ball.draw();
    update();
}

// Function to increase speed after every 10 points
function increaseSpd() {
    if(points % 10 == 0) {
        if(Math.abs(ball.vx) < 15) {
            ball.vx += (ball.vx < 0) ? -1 : 1;
            ball.vy += (ball.vy < 0) ? -2 : 2;
        }
    }
}

// Track the position of mouse cursor
function trackPosition(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
}

function movePad(input) {


	// APPUYER
	if(input.User == 1){
		if(input.value == "LOW"){
			if(input.button == "A")
				paddles[1].left = true;
			if(input.button == "C")
				paddles[1].right = true;
		}
	}

	if(input.User == 2){
		if(input.value == "LOW"){
			if(input.button == "A")
				paddles[2].left = true;
			if(input.button == "C")
				paddles[2].right = true;
		}
	}

	// RELACHER
	if(input.User == 1){
		if(input.value == "HIGH"){
			if(input.button == "A")
				paddles[1].left = false;
			if(input.button == "C")
				paddles[1].right = false;
		}
	}

	if(input.User == 2){
		if(input.value == "HIGH"){
			if(input.button == "A")
				paddles[2].left = false;
			if(input.button == "C")
				paddles[2].right = false;
		}
	}


}

function updatePad(){
	if(paddles[1].left)
		paddles[1].x -= paddleVx;
	else if(paddles[1].right)
		paddles[1].x += paddleVx;

	if(paddles[2].left)
		paddles[2].x -= paddleVx;
	else if(paddles[2].right)
		paddles[2].x += paddleVx;
}

// Function to update positions, score and everything.
// Basically, the main game logic is defined here
function update() {


    // Move the paddles on mouse move
    // a changer

    // movePad(paddles[1], paddles[2]);
    updatePad();
    // Move the ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Collision with paddles
    p1 = paddles[1];
    p2 = paddles[2];

    // If the ball strikes with paddles,
    // invert the y-velocity vector of ball,
    // increment the points, play the collision sound,
    // save collision's position so that sparks can be
    // emitted from that position, set the flag variable,
    // and change the multiplier
    if(collides(ball, p1)) {
        collideAction(ball, p1);
    }


    else if(collides(ball, p2)) {
        collideAction(ball, p2);
    }

    else {
        // Collide with walls, If the ball hits the top/bottom,
        // walls, run gameOver() function
        if(ball.y + ball.r > H) {
            ball.y = H - ball.r;
            gameOver();
        }

        else if(ball.y < 0) {
            ball.y = ball.r;
            gameOver();
        }

        // If ball strikes the vertical walls, invert the
        // x-velocity vector of ball
        if(ball.x + ball.r > W) {
            ball.vx = -ball.vx;
            ball.x = W - ball.r;
        }

        else if(ball.x -ball.r < 0) {
            ball.vx = -ball.vx;
            ball.x = ball.r;
        }
    }



    // If flag is set, push the particles
    if(flag == 1) {
        for(var k = 0; k < particlesCount; k++) {
            particles.push(new createParticles(particlePos.x, particlePos.y, multiplier));
        }
    }

    // Update scores
    updateScore();


    // Emit particles/sparks
    emitParticles();

    // reset flag
    flag = 0;
}

//Function to check collision between ball and one of
//the paddles
function collides(b, p) {
    if(b.x + ball.r >= p.x && b.x - ball.r <=p.x + p.w) {
        if(b.y >= (p.y - p.h) && p.y > 0){
            paddleHit = 1;
            return true;
        }

        else if(b.y <= p.h && p.y == 0) {
            paddleHit = 2;
            return true;
        }

        else return false;
    }
}

//Do this when collides == true
function collideAction(ball, p) {
    ball.vy = -ball.vy;

    if(paddleHit == 1) {
        ball.y = p.y - p.h;
        particlePos.y = ball.y + ball.r;
        multiplier = -1;
    }

    else if(paddleHit == 2) {
        ball.y = p.h + ball.r;
        particlePos.y = ball.y - ball.r;
        multiplier = 1;
    }

    points++;
    increaseSpd();

    if(collision) {
        if(points > 0)
            collision.pause();

        collision.currentTime = 0;
        collision.play();
    }

    particlePos.x = ball.x;
    flag = 1;
}

// Function for emitting particles
function emitParticles() {
    for(var j = 0; j < particles.length; j++) {
        par = particles[j];

        ctx.beginPath();
        ctx.fillStyle = "white";
        if (par.radius > 0) {
            ctx.arc(par.x, par.y, par.radius, 0, Math.PI*2, false);
        }
        ctx.fill();

        par.x += par.vx;
        par.y += par.vy;

        // Reduce radius so that the particles die after a few seconds
        par.radius = Math.max(par.radius - 0.05, 0.0);

    }
}

// Function for updating score
function updateScore() {
    ctx.fillStlye = "white";
    ctx.font = "16px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score1 + " - " + score2, 20, 20 );
}

// Function to run when the game overs
function gameOver() {
    // ctx.fillStlye = "white";
    // ctx.font = "20px Arial, sans-serif";
    // ctx.textAlign = "center";
    // ctx.textBaseline = "middle";
    // ctx.fillText("Game Over - You scored "+points+" points!", W/2, H/2 + 25 );

    // Stop the Animation
    cancelRequestAnimFrame(init);

    // Set the over flag
    over = 1;


    // score1: bas avec multiplier=-1
    if (multiplier == 1 ) score2++;
    else score1++;

    // attends 2s et recommence
    if(score1 >= 3 || score2 >= 3)
        gameEnd();
    else{
        scorePause.draw();
        setTimeout(() => {  restartScreen(); }, 2000);
    }
    
}

// Function for running the whole animation
function animloop() {
    init = requestAnimFrame(animloop);
    draw();
}

// Function to execute at startup
function startScreen() {
    draw();
    startBtn.draw();
}


function restartScreen() {
    if(over == 1) {
        ball.x = 20;
        ball.y = 20;
        points = 0;
        ball.vx = 4;
        ball.vy = 8;
        animloop();

        over = 0;
        multiplier = 1;

        //remet les raquettes a leur position d'origine
        for(var i = 1; i<3; i++)
        {
            paddles[i].x = W/2 - paddles[1].w/2;
            paddles[i].vx = 0.2;
        }
    }
}
// On button click (Restart and start)
// a changer
function btnClick(e) {

    // Variables for storing mouse position on click
    var mx = e.pageX,
        my = e.pageY;

    // Click start button
    if(mx >= startBtn.x && mx <= startBtn.x + startBtn.w) {
    { 
    	animloop();
    	document.getElementById("startButton").style.display = "none"
    }
        // Delete the start button after clicking it
        startBtn = {};
            
    }
}

function startButton(input) {
	if(input.value == "LOW"){
        if(input.button == "A" || input.button == "B" || input.button == "C"|| input.button == "D" ) 
        {
           	clickToStart = true;
           	animloop();
    		document.getElementById("startButton").style.display = "none"
        }
    }

}

// envoie des scores a l'API
function gameEnd(){
    var gagnant = "";
    scorePause.draw();
    if(score1 > score2)
        gagnant = "joueur1";
    else
        gagnant = "joueur2"
    endScore.draw(gagnant);


    document.getElementById("gamesList").style.display = "block";


    //envoyer le score 1 / 2
    //envoyer le nb d'échanges: points
    //envoyer l'ID du gagnant / perdant
}



// Show the start screen
startScreen();
