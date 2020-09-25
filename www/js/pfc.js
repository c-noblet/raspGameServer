window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback ){
            return window.setTimeout(callback, 1000 / 60);
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
            selection(input);

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
    score1 = 0,
    score2 = 0,
    choix1 = "",
    choix2 = "",
    j1 = "joueur1",
    j2 = "joueur2",
    gg= "",
    ggChosen = false,
    startBtn = {},
    init,
    affResult = false;

canvas.width = W;
canvas.height = H;

start = {
    draw: function() {
        var rock = document.getElementById("rock");
        var paper = document.getElementById("paper");
        var scissors = document.getElementById("scissors");

        ctx.drawImage(rock,W/3-500, H/2-250, 500,500);
        ctx.drawImage(paper,2*W/3-500, H/2-250, 500,500);
        ctx.drawImage(scissors,3*W/3-500, H/2-250, 500,500);
    }
}


scores = {
    draw: function () {
            ctx.font = "32px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "white";
            ctx.fillText(score1, W/2, H-20);
            ctx.fillText(score2, W/2, 20 );
    }
}

attenteChoix = {
    draw: function (c1,c2) {
        ctx.font = "24px Arial, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        ctx.fillStyle = "white";
        if(!c1)
            ctx.fillText("En attente de " + j1, 0, H);
        
        if(!c2)
            ctx.fillText("En attente de " + j2, 0, H-24);

    }
}

afficherChoix = {
    draw: function () {
        var rock = document.getElementById("rock");
        var paper = document.getElementById("paper");
        var scissors = document.getElementById("scissors");

        var rock2 = document.getElementById("rock2");
        var paper2 = document.getElementById("paper2");
        var scissors2 = document.getElementById("scissors2");

        var tick = document.getElementById("tick");

        if(choix1 == "rock") ctx.drawImage(rock,W/2-175, H-280, 350,350);
        if(choix1 == "paper") ctx.drawImage(paper,W/2-175, H-280, 350,350);
        if(choix1 == "scissors") ctx.drawImage(scissors,W/2-175, H-280, 350,350);

        if(choix2 == "rock") ctx.drawImage(rock,W/2-175, -88, 350,350);
        if(choix2 == "paper") ctx.drawImage(paper,W/2-175, -88, 350,350);
        if(choix2 == "scissors") ctx.drawImage(scissors,W/2-175, -88, 350,350);

        if(gg==j2)
            ctx.drawImage(tick,3*W/5, 0+15, 150,150);
        if(gg==j1)
            ctx.drawImage(tick,3*W/5, H-165, 150,150);



        ctx.fillStyle =  "#000000",
        ctx.fillRect(W/3-500, H/2-110 , 4000,220);
        ctx.drawImage(rock2,W/3-500, H/2-250, 500,500);
        ctx.drawImage(paper2,2*W/3-500, H/2-250, 500,500);
        ctx.drawImage(scissors2,3*W/3-500, H/2-250, 500,500);
    }
}

endResult = {
    draw: function () {
        ctx.font = "32px Arial, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        ctx.fillStyle = "white";

        let j = score1>score2?j1:j2
        ctx.fillText(j + " a gagné", 0, H);
    }
}


function selection(input){
    if(input.User == 1){
        if(input.value == "LOW"){
            if(input.button == "A")
                choix1 = "rock";
            if(input.button == "B")
                choix1 = "paper";
            if(input.button == "C")
                choix1 = "scissors";
        }
    }

    if(input.User == 2){
        if(input.value == "LOW"){
            if(input.button == "A")
                choix2 = "rock";
            if(input.button == "B")
                choix2 = "paper";
            if(input.button == "C")
                choix2 = "scissors";
        }
    }

//     document.addEventListener('keydown', function(event) {
//         if(event.keyCode == 81) choix1 = "rock";
//         if(event.keyCode == 83) choix1 = "paper";
//         if(event.keyCode == 68) choix1 =  "scissors";

//         if(event.keyCode == 37) choix2 = "rock";
//         if(event.keyCode == 40) choix2 = "paper";
//         if(event.keyCode == 39) choix2 = "scissors";
//     });
}

function gagnant(){

    if(choix1 === "rock")
        if(choix2 === "paper") {gg = j2; score2++}
        else if(choix2 === "scissors") {gg = j1; score1++}

    if(choix1 === "paper")
        if(choix2 === "rock") {gg = j1; score1++}
        else if(choix2 === "scissors") {gg = j2; score2++}

    if(choix1 === "scissors")
        if(choix2 === "rock") {gg = j2; score2++}
        else if(choix2 === "paper") {gg = j1; score1++}

    // choix1 = "";
    // choix2 = "";
    ggChosen = true;

}

function resetChoices(){
    choix1 = ""; 
    choix2 = "";
    gg = "";
    ggChosen = false;
}

function stopGame(){
    endResult.draw();
    document.getElementById("gamesList").style.display = "block";
    // envoie des données a api
    // score1, score2, gg
}

function paintCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, W, H);
}

function update(){
    start.draw();
    scores.draw();
    attenteChoix.draw(choix1, choix2);
    if(choix1 !== "" && choix2 !== "")
    {   
        if(!ggChosen)
        {
            setTimeout(() => {resetChoices();}, 2000 );
            gagnant();
        }
        afficherChoix.draw();
    }
}

 function draw() {
   
    paintCanvas();
    update();

}

function animloop() {
    init = requestAnimFrame(animloop);
    draw();
    if(score1 >= 3 || score2 >= 3)
    {
        stopGame();
        setTimeout(() => {cancelRequestAnimFrame(init);}, 500); 
    }
}

animloop();