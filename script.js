$(document).ready(function() {
  $('#new-game').click(function(e) {
    $('#new-game').hide();
      
    newGame(); 
    console.log('new game button pressed');
  })
  $('#guess').click(function(e){
    e.preventDefault();
    //console.log($('.letter').val())
    guessLetter();
  })
});
 
function isLetter(value) {
  // check if letter here
  if (value.trim()==""){ // let value=value.trim() 
    return false; 
  }else if ($.isNumeric(value)) {
    return false;
  } else { 
    // return true if is letter
    return true;
  }
  
}
  
function newGame() {

    $.ajax({
      type: "POST",
      url: "https://hangman-api.herokuapp.com/hangman",
    }).done(function(data) {
        
      $('.hangman-word').text(data.hangman);
      $('.token').val(data.token);
      
    }).fail(function(data) {
      console.log(data)
    });
  }

function guessLetter() {
  
  $('#error-message').empty();
  const token = $('.token').val();
  const letter = $('.letter').val().toLowerCase();


 if (isLetter(letter)) {
    ajaxGuessLetter(token, letter)//if isLetter true -> do ajax
 } else{
   $('#error-message').append("no way!!!!")
 }
   $('#text').val("") // document.getElementById("text").value=""
   
   
  // else let's tell the user no
    // otherFunction()
}
 
function solution(token){
  $.ajax({
    type: "GET",
    url: "http://hangman-api.herokuapp.com/hangman",
    data: {token: token }
  }).done(function(data) {
    $('.hangman-word').text(data.solution);
    console.log('solution function:', data)
    $('#text').hide();
    $('#new-game').show();
  }).fail(function(data) {
    console.log(data) 
});
}

function ajaxGuessLetter(token, letter) {
  $.ajax({
    type: "PUT",
    url: "http://hangman-api.herokuapp.com/hangman",
    data: {token: token, letter: letter}
    }).done(function(data){
      console.log(data)
      $('.hangman-word').text(data.hangman);
      $('.token').val(data.token);
      let attempt = $('<span/>')
      attempt.html(letter)
      $('.attempts').append(attempt)
      let wrongAttemptsCounter;
      if(data.correct == false){
        //console.log("here I am")
        attempt.addClass('wrong');
        wrongAttemptsCounter = $('.wrong').length;
        $('.remaining').html(7-wrongAttemptsCounter);
    } else {
      attempt.addClass('correct');
    }
    if (wrongAttemptsCounter >= 7){
      solution(token);
    }
    }).fail(function(data) {
      console.log(data)  
  });
}