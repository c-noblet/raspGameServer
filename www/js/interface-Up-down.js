var dbPlayer;
var player1 = "";
var player2 = "";
var currentSelectPlayer = [0, 0];
var currentSelectGame = 0;


// if(readCookie("game")){
//     alert("existing cookie")
//     skipToGameSelector();
// }else{
//     alert("no existing cookie")
// }

function fakeManetteReady(){
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
    var unOrganizeListPlayer = listUsers; // Get list from No-code
    var organizeListPlayer = [];
    var singleArray = [];
    var i = 0;
    $.each(unOrganizeListPlayer, function(key, data){
        i++;
        if(i <= 3){
            singleArray.push(data);
        }else{
            organizeListPlayer.push(singleArray);
            singleArray = [data];
            i = 1;
        }
        if(key === unOrganizeListPlayer.length - 1){
            organizeListPlayer.push(singleArray);
        }
    });
    dbPlayer = organizeListPlayer;
}

function printListPlayer(listPlayer){
    $.each(listPlayer, function(keyRow, dataRow){
        $.each(dataRow, function(keyColumn, dataColumn){
            var divPlayer = $( "<div class='single-player' data-row='"+ keyRow +"' data-column='"+ keyColumn +"'><img src='img/user.png' alt=''><p>" + dataColumn + "</p></div>" );
            $("#selection-player").append(divPlayer);
        });
    });

    // Select player 
    selectPlayer(0, 0);
}

// Select player in interface
function selectPlayer(y, x){
    $(".single-player").removeClass('active-player-1');
    $(".single-player").removeClass('active-player-2');
    if(player1){
        $("div[data-row='" + y +"'][data-column='" + x +"']").addClass("active-player-2");
    }else{
        $("div[data-row='" + y +"'][data-column='" + x +"']").addClass("active-player-1");
    }
}

function checkIfPlayerExist(y, x){
    if($("div[data-row='" + y +"'][data-column='" + x +"']").length != 0){
        return true;
    }else{
        return false;
    }
}

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

// Detect keyPress action
document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    //Up manette 1
    if (e.keyCode == '38') {
        // console.log('Up 1');
        upController(1);
    }
    //down manette 1
    else if (e.keyCode == '40') {
        // console.log('down 1');
        downController(1);
    }
    //left manette 1
    else if (e.keyCode == '37') {
        // console.log('left 1');
        leftController(1);

    }
    //right manette 1
    else if (e.keyCode == '39') {
        // console.log('right 1');
        rightController(1);
    }
    //enter manette 1
    else if (e.keyCode == '13') {
        // console.log('enter 1')
        enterController(1);
    }

    //Up manette 2
    if (e.keyCode == '90') {
        // console.log('Up 2');
        upController(2)
    }
    //down manette 2
    else if (e.keyCode == '83') {
        // console.log('down 2');
        downController(2);
    }
    //left manette 2
    else if (e.keyCode == '81') {
        // console.log('left 2');
        leftController(2);
    }
    //right manette 2
    else if (e.keyCode == '68') {
        // console.log('right 2');
        rightController(2);
    }

    //enter manette 2
    else if (e.keyCode == '70') {
        // console.log('enter 2');
        enterController(2);
    }
}

function upController(player){
    // Case action up from player 1
    if(player === 1){
        if($("#container-player").is(":visible") && player1 == ""){
            if(checkIfPlayerExist((currentSelectPlayer[0]-1), currentSelectPlayer[1])){
                currentSelectPlayer = [currentSelectPlayer[0]-1, currentSelectPlayer[1]]
            }else{
                if(checkIfPlayerExist(dbPlayer.length - 1, currentSelectPlayer[1])){
                    currentSelectPlayer = [dbPlayer.length - 1, currentSelectPlayer[1]]
                }else{
                    currentSelectPlayer = [dbPlayer.length - 2, currentSelectPlayer[1]]
                }
            }
            selectPlayer(currentSelectPlayer[0], currentSelectPlayer[1]);
        }
    }else if(player === 2){
        // Case action up from player 2
        if($("#container-player").is(":visible") && player1){
            if(checkIfPlayerExist((currentSelectPlayer[0]-1), currentSelectPlayer[1])){
                currentSelectPlayer = [currentSelectPlayer[0]-1, currentSelectPlayer[1]]
            }else{
                if(checkIfPlayerExist(dbPlayer.length - 1, currentSelectPlayer[1])){
                    currentSelectPlayer = [dbPlayer.length - 1, currentSelectPlayer[1]]
                }else{
                    currentSelectPlayer = [dbPlayer.length - 2, currentSelectPlayer[1]]
                }
            }
            selectPlayer(currentSelectPlayer[0], currentSelectPlayer[1]);
        }
    }
}

function downController(player){
    if(player === 1){
        if($("#container-player").is(":visible") && player1 == ""){
            if(checkIfPlayerExist((currentSelectPlayer[0]+1), currentSelectPlayer[1])){
                currentSelectPlayer = [currentSelectPlayer[0]+1, currentSelectPlayer[1]]
            }else{
                currentSelectPlayer = [0, currentSelectPlayer[1]]
            }
            selectPlayer(currentSelectPlayer[0], currentSelectPlayer[1]);
        }
    }else if(player === 2){
        if($("#container-player").is(":visible") && player1){
            if(checkIfPlayerExist((currentSelectPlayer[0]+1), currentSelectPlayer[1])){
                currentSelectPlayer = [currentSelectPlayer[0]+1, currentSelectPlayer[1]]
            }else{
                currentSelectPlayer = [0, currentSelectPlayer[1]]
            }
            selectPlayer(currentSelectPlayer[0], currentSelectPlayer[1]);
        }
    }
}

function rightController(player){
    if(player === 1){
        if($("#container-player").is(":visible") && player1 == ""){
            if(checkIfPlayerExist((currentSelectPlayer[0]), currentSelectPlayer[1] + 1)){
                currentSelectPlayer = [currentSelectPlayer[0], currentSelectPlayer[1] + 1]
            }else{
                currentSelectPlayer = [currentSelectPlayer[0], 0]
            }
            selectPlayer(currentSelectPlayer[0], currentSelectPlayer[1]);
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
            if(checkIfPlayerExist((currentSelectPlayer[0]), currentSelectPlayer[1] + 1)){
                currentSelectPlayer = [currentSelectPlayer[0], currentSelectPlayer[1] + 1]
            }else{
                currentSelectPlayer = [currentSelectPlayer[0], 0]
            }
            selectPlayer(currentSelectPlayer[0], currentSelectPlayer[1]);
        }
    }
}

function leftController(player){
    if(player === 1){
        if($("#container-player").is(":visible") && player1 == ""){
            if(checkIfPlayerExist((currentSelectPlayer[0]), currentSelectPlayer[1] - 1)){
                currentSelectPlayer = [currentSelectPlayer[0], currentSelectPlayer[1] - 1]
            }else{
                currentSelectPlayer = [currentSelectPlayer[0], dbPlayer[currentSelectPlayer[0]].length - 1]
            }
            selectPlayer(currentSelectPlayer[0], currentSelectPlayer[1]);
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
            if(checkIfPlayerExist((currentSelectPlayer[0]), currentSelectPlayer[1] - 1)){
                currentSelectPlayer = [currentSelectPlayer[0], currentSelectPlayer[1] - 1]
            }else{
                currentSelectPlayer = [currentSelectPlayer[0], dbPlayer[currentSelectPlayer[0]].length - 1]
            }
            selectPlayer(currentSelectPlayer[0], currentSelectPlayer[1]);
        }
    }
}

function enterController(player){
    if(player === 1){
        if($("#container-player").is(":visible") && player1 == ""){
            player1 = $(".active-player-1").children('p').text();
            currentSelectPlayer = [0,0];
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