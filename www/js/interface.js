var dbPlayer;
var player1 = "";
var player2 = "";
var currentSelectPlayer = 0;
var currentSelectGame = 0;
var connectedController = [false, false];

// if(readCookie("game")){
//     alert("existing cookie")
//     skipToGameSelector();
// }else{
//     alert("no existing cookie")
// }


/****************************************************************************/
/*************************** Container Controller ****************************/
/****************************************************************************/


function manetteReady(){
    if(dbPlayer){
        // Hide manette container
        $("#container-manette").hide();

        // Show Select player container 
        $("#container-player").show();
        printListPlayer(dbPlayer);
    }else{
        alert("Data not ready");
    }
}

function setControllerConnected(idController){
    $("#controller"+idController+" .spin-loader").removeClass("spin-loader").text("Manette connectée");

}

function skipToGameSelector(){
    $("#container-manette").hide();
    $("#container-player").hide();
    $("#container-game").show();
    player1 = "test1";
    player2 = "test2";
}

/****************************************************************************/
/*************************** Container Player  ******************************/
/****************************************************************************/

// Organise array from No-code to bidimensional array
function getListPlayer(listUsers){
    dbPlayer = listUsers;
}

// Print all users in interface
function printListPlayer(listPlayer){
    $.each(listPlayer, function(key, data){
        var divPlayer = $( "<div class='single-player' data-id='"+key+"'><img src='img/user.png' alt=''><p>" + data + "</p></div>" );
        $("#selection-player").append(divPlayer);
    });

    // Select player 
    selectPlayer(0);
}

// Select player in interface
function selectPlayer(id){
    $(".single-player").removeClass('active-player-1');
    $(".single-player").removeClass('active-player-2');
    if(player1){
        $("div[data-id='" + id +"']").addClass("active-player-2");
    }else{
        $("div[data-id='" + id +"']").addClass("active-player-1");
    }
}

// Check if specific player (depending of id) exist
function checkIfPlayerExist(id){
    if($("div[data-id='" + id +"']").length != 0){
        return true;
    }else{
        return false;
    }
}

// Valid selection player
function endSelectPlayer(){
    $("#container-player").hide();
    console.log(player1, player2);
    $("#container-game").show();
}

/**************************************************************************/
/*************************** Container Game  ******************************/
/**************************************************************************/


function checkIfGameExist(x){
    if($("div.game[data-game='" + x +"']").length != 0){
        return true;
    }else{
        return false;
    }
}

function selectGame(x){
    $(".game.active").removeClass("active");
    $(".game[data-game='" + x + "']").addClass("active");
}

/**************************************************************************/
/*************************** Global Control  ******************************/
/**************************************************************************/

var socket = io.connect('192.168.43.54:3000');
socket.on('connect', function() {
    console.log('connect');
    socket.on('manette', function(msg) {
	console.log(msg.message);
        let data = JSON.parse(msg.message);
	console.log(data);        
// Check if controller are connected, YES -> Move / NO -> Wait for all controller connected and set current controller connected
        if(connectedController[0] && connectedController[1]){
            userControl(data.User, data.button, data.value);
        }else{
            if(data.User === 1 && !connectedController[0] && connectedController[1]){
                connectedController[0] = true;
                manetteReady();
            }
            if(data.User === 2 && connectedController[0] && !connectedController[1]){
                connectedController[1] = true;
                manetteReady()
            }
            if(data.User === 1 && !connectedController[0] && !connectedController[1]){
                connectedController[0] = true;
                setControllerConnected(1);
            }
            if(data.User === 2 && !connectedController[0] && !connectedController[1]){
                connectedController[1] = true;
                setControllerConnected(2);
            }
        }
    });
});

$(document).ready(function (){
    socket.emit('subscribe', {topic:'manette'});
});

function userControl(user, command, type) {

    //left manette 1
    if (user === 1 && command === "A" && type === "LOW") {
        leftController(1);
    }

    //right manette 1
    if (user === 1 && command === "C" && type === "LOW") {
        // console.log('right 1');
        rightController(1);
    }

    //enter manette 1
    if (user === 1 && command === "B" && type === "LOW") {
        // console.log('enter 1')
        enterController(1);
    }

    //left manette 2
    if (user === 2 && command === "A" && type === "LOW") {
        // console.log('left 2');
        leftController(2);
    }

    //right manette 2
    if (user === 2 && command === "C" && type === "LOW") {
        // console.log('right 2');
        rightController(2);
    }

    //enter manette 2
    if (user === 2 && command === "B" && type === "LOW") {
        // console.log('enter 2');
        enterController(2);
    }
}

function rightController(player){
    if(player === 1){
        if($("#container-player").is(":visible") && player1 == ""){
            if(checkIfPlayerExist(currentSelectPlayer + 1)){
                currentSelectPlayer = currentSelectPlayer + 1;
            }else{
                currentSelectPlayer = 0;
            }
            selectPlayer(currentSelectPlayer);
        }
        if($("#container-game").is(":visible") && player1){
            if(checkIfGameExist(currentSelectGame + 1)){
                selectGame(currentSelectGame + 1);
                currentSelectGame = currentSelectGame + 1;
            }else{
                selectGame(0);
                currentSelectGame = 0;
            }
        }
    }else if(player === 2){
        if($("#container-player").is(":visible") && player1){
            if(checkIfPlayerExist(currentSelectPlayer + 1)){
                currentSelectPlayer = currentSelectPlayer + 1;
            }else{
                currentSelectPlayer = 0;
            }
            selectPlayer(currentSelectPlayer);
        }
    }
}

function leftController(player){
    if(player === 1){
        if($("#container-player").is(":visible") && player1 == ""){
            if(checkIfPlayerExist(currentSelectPlayer - 1)){
                currentSelectPlayer = currentSelectPlayer - 1;
            }else{
                currentSelectPlayer = dbPlayer.length-1;
            }
            selectPlayer(currentSelectPlayer);
        }
        if($("#container-game").is(":visible") && player1){
            if(checkIfGameExist(currentSelectGame - 1)){
                selectGame(currentSelectGame - 1);
                currentSelectGame = currentSelectGame - 1;
            }else{
                selectGame(2);
                currentSelectGame = 2;
            }
        }
    }else if(player === 2){
        if($("#container-player").is(":visible") && player1){
            if(checkIfPlayerExist(currentSelectPlayer - 1)){
                currentSelectPlayer = currentSelectPlayer - 1;
            }else{
                currentSelectPlayer = dbPlayer.length-1;
            }
            selectPlayer(currentSelectPlayer);
        }
    }
}

function enterController(player){
    if(player === 1){
        if($("#container-player").is(":visible") && player1 == ""){
            player1 = $(".active-player-1").children('p').text();
            currentSelectPlayer = 0;
            $("#container-player .title").text("Choix de pseudo du joueur n°2");
            selectPlayer(0,0);
        }
        if($("#container-game").is(":visible") && player1){
            switch($(".game.active").data("game")){
                case 0:
                    document.cookie = 'game = pong';
                    if (window.location.href.indexOf("index") > -1) {
                        newUrl = window.location.href.replace('index', 'pong');
                    }else{
                        newUrl = window.location.href + "pong.html"
                    }
                    window.location.href = newUrl;
                    break;
                case 1:
                    // writeCookie("game", "pfc");
                    if (window.location.href.indexOf("index") > -1) {
                        newUrl = window.location.href.replace('index', 'pfc');
                    }else{
                        newUrl = window.location.href + "pfc.html"
                    }
                    window.location.href = newUrl;
                    break;
            }
        }
    }else if($("#container-player").is(":visible") && player1){
        player2 = $(".active-player-2").children('p').text();
        endSelectPlayer();
    }
}
