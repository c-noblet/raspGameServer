// Settings
let specGameOn = true;
let gameName = "Nom du jeu";
let pseudoJ1 = "Pseudo_joueur_1";
let pseudoJ2 = "Pseudo_joueur_2";
let scoreJ1 = 0;
let scoreJ2 = 0;


// Show or Hide game
function setSpecGameOnOff() {
  if (specGameOn == true) {
    $('.nogame').hide();
    $('.game-block').show();
  } else {
    $('.nogame').show();
    $('.game-block').hide();
  }
}

// Set game name
function setSpecGameName() {
  $('.game-name').text(gameName);
}

// Set players names
function setSpecPlayersNames() {
  $('.pseudo1').text(pseudoJ1);
  $('.pseudo2').text(pseudoJ2);
}

// Set score
function setSpecScore() {
  $('.score1').text(scoreJ1);
  $('.score2').text(scoreJ2);
}

// Set timer
/*
 * Basic Count Up from Date and Time
 * Author: @mrwigster / https://guwii.com/bytes/count-date-time-javascript/
 */
function setSpecTimer(countFrom, id) {
  countFrom = new Date(countFrom).getTime();
  var now = new Date(),
      countFrom = new Date(countFrom),
      timeDifference = (now - countFrom);

  var secondsInADay = 60 * 60 * 1000 * 24,
      secondsInAHour = 60 * 60 * 1000;

  days = Math.floor(timeDifference / (secondsInADay) * 1);
  hours = Math.floor((timeDifference % (secondsInADay)) / (secondsInAHour) * 1);
  mins = Math.floor(((timeDifference % (secondsInADay)) % (secondsInAHour)) / (60 * 1000) * 1);
  secs = Math.floor((((timeDifference % (secondsInADay)) % (secondsInAHour)) % (60 * 1000)) / 1000 * 1);

  var idEl = document.getElementById(id);
  idEl.getElementsByClassName('minutes')[0].innerHTML = mins;
  idEl.getElementsByClassName('seconds')[0].innerHTML = secs;

  clearTimeout(setSpecTimer.interval);
  setSpecTimer.interval = setTimeout(function(){ setSpecTimer(countFrom, id); }, 1000);
}

// Initialise
setSpecGameOnOff();
setSpecGameName();
setSpecPlayersNames();
setSpecTimer("Sep 23, 2020 15:55:00", 'countup1');


function getData(){
  // traitement - websocket


  // rappel après 2 secondes = 2000 millisecondes
  setTimeout('getData',2000);
}

getData();
