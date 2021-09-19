
const $card_image = $('#card_image');
const $val_play = $('#val_play');
const $val_comp = $('#val_comp');
const $remain_play= $('#remain_play');
let deck;
let valTotal_playScore = 0;
let valTotal_compScore = 0;
let prevCard_play = null;
let prevCard_comp = null;

function getGameStarted (){
  valTotal_playScore = 0;
  valTotal_compScore = 0;
  document.getElementById('remain_play').innerHTML = 26;
  render();
  const promise = $.ajax({
      url:'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
  });
  // card player
  promise.then(
    (data) => {
      console.log(data)
      deck = data
    },
    (error) => {
    console.log('bad request: ', error);
    }
  );
}

// player
function getCardPlayer(data){
  let deck_id = data.deck_id
  const promise1 = $.ajax({
      url:'https://deckofcardsapi.com/api/deck/' + deck_id + '/draw/?count=1'
  });
  // computer card
  // promise to return the card value
  let prom = new Promise((resolve, reject) => {
    promise1.then(
      (data) => {
        // console.log(data)
        data.cards.map(card=>{
          $('#cards_player').html($('<img>',{src:card.image}))
          if(card.value == "JACK"){
            card.value = "11";
          }
          if(card.value == "QUEEN"){
            card.value = "12";
          }
          if(card.value == "KING" || card.value == "ACE"){
            card.value = "13";
          }
          $val_play.text(card.value);
          // to resolve promise of card.value
          resolve(parseInt(card.value));
        })
      },
      (error) => {
      console.log('bad request: ', error);
      reject();
      }
    );
  });
  return prom;
}

// computer
function getCardComputer(data){
  let deck_id = data.deck_id
  const promise2 = $.ajax({
      url:'https://deckofcardsapi.com/api/deck/' + deck_id + '/draw/?count=1'
  });

  let prom = new Promise((resolve, reject) => {
    promise2.then(
      (data) => {
        // console.log(data)
        document.getElementById('remain_play').innerHTML = (data.remaining / 2);
        data.cards.map(card=>{
          $('#cards_computer').html($('<img>',{src:card.image}))
          if(card.value == "JACK"){
            card.value = "11";
          }
          if(card.value == "QUEEN"){
            card.value = "12";
          }
          if(card.value == "KING" || card.value == "ACE"){
            card.value = "13";
          }
          $val_comp.text(card.value);
          // to resolve promise of card.value
          resolve(parseInt(card.value));
        })
      },
      (error) => {
      console.log('bad request: ', error);
      reject();
      }
    );
  })
  return prom;
}

function scoreBoard(play_score,comp_score){
  if(play_score == comp_score){
    prevCard_play = play_score;
    prevCard_comp = comp_score;
    valTotal_playScore = valTotal_playScore += 1;
    valTotal_compScore = valTotal_compScore += 1;
    return 0;
  }
  if(play_score > comp_score){
    console.log('player won!')
    if(prevCard_play != null && prevCard_comp != null){
      valTotal_playScore = valTotal_playScore += 1;
      valTotal_compScore = valTotal_compScore -= 1;
      prevCard_play, prevCard_comp = null;
      render();
    }
    valTotal_playScore = valTotal_playScore += 1;
    console.log('Player Score: ' + valTotal_playScore);
    console.log('Computer Score: ' + valTotal_compScore);
    render();
  }else {
    console.log('Computer won!')
    if(prevCard_play != null && prevCard_comp != null){
      valTotal_playScore = valTotal_playScore -= 1;
      valTotal_compScore = valTotal_compScore += 1;
      prevCard_play, prevCard_comp = null;
      render();
    }
    valTotal_compScore = valTotal_compScore += 1;
    console.log('Player Score: ' + valTotal_playScore);
    console.log('Computer Score: ' + valTotal_compScore);
    render();
  }
}
function render(){
  document.getElementById("player_total").innerHTML = 'Play Score: ' + valTotal_playScore;
  document.getElementById("computer_total").innerHTML = 'Comp Score: ' + valTotal_compScore;
}

async function nextTurn(){
  // wait for the play card value
    let play_score = await getCardPlayer(deck)
  // wait for the comp card value
    let comp_score = await getCardComputer(deck)
    scoreBoard(play_score,comp_score)
}
