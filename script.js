const $card_image = $('#card_image');
const $val_play = $('#val_play');
const $val_comp = $('#val_comp');
const $reamain_play= $('#reamain_play');
let deck;
let valTotal_play = 0;
let valTotal_comp = 0;


function getGameStarted (){
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

function nextTurn(){
    getCardPlayer(deck)
    getCardComputer(deck)
}
// player
function getCardPlayer(data){
  let deck_id = data.deck_id
  const promise1 = $.ajax({
      url:'https://deckofcardsapi.com/api/deck/' + deck_id + '/draw/?count=1'
  });
  // computer card
  promise1.then(
    (data) => {
      console.log(data)
      data.cards.map(card=>{
        $('#cards_player').html($('<img>',{src:card.image}))
        console.log(card.value)
        $val_play.text(card.value);


      })
    },
    (error) => {
    console.log('bad request: ', error);
    }


    
  );
}
// computer
function getCardComputer(data){
  let deck_id = data.deck_id
  const promise2 = $.ajax({
      url:'https://deckofcardsapi.com/api/deck/' + deck_id + '/draw/?count=1'
  });

  promise2.then(
    (data) => {
      console.log(data)
      document.getElementById('reamain_play').innerHTML = (data.remaining / 2);
      data.cards.map(card=>{
        $('#cards_computer').html($('<img>',{src:card.image}))
        $val_comp.text(card.value);  
        // let val_comp = card.value;
        //  console.log(val_comp);
      })
    },
    (error) => {
    console.log('bad request: ', error);
    }
  );
}

