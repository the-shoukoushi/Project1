var cards = [];
var suits = ["spades", "hearts", "clubs", "diamonds"];
var numb = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var playerCard = [];
var dealerCard = [];
var cardCount = 0;
var mydollars = 500;
var endplay = false;
var message = document.getElementById('message');
var output = document.getElementById('output');
var dealerHolder = document.getElementById('dealerHolder');
var playerHolder = document.getElementById('playerHolder');
var pValue = document.getElementById('pValue');
var dValue = document.getElementById('dValue');
var dollarValue = document.getElementById('dollars');
document.getElementById('mybet').onchange = function () {
    if (this.value < 0) {
        this.value = 0;
    }
    if (this.value > mydollars) {
        this.value = mydollars;
    }
    message.innerHTML = "Bet changed to $" + this.value;
}
for (s in suits) {
    var suit = suits[s][0].toUpperCase();
    var bgcolor = (suit == "S" || suit == "C") ? "black" : "red";
    for (n in numb) {
        var cardValue = (n > 9) ? 10 : parseInt(n) + 1;
        var card = {
            suit: suit,
            icon: suits[s],
            bgcolor: bgcolor,
            cardnum: numb[n],
            cardvalue: cardValue
        }
        cards.push(card);
    }
}

function shuffleD(array) {                                 //Function for shuffling the cards
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function dealNew() {
    dValue.innerHTML = "?";
    playerCard = [];
    dealerCard = [];
    dealerHolder.innerHTML = "";
    playerHolder.innerHTML = "";
    var betvalue = document.getElementById('mybet').value;
    mydollars = mydollars - betvalue;
    document.getElementById('dollars').innerHTML = mydollars;
    document.getElementById('myactions').style.display = 'block';
    message.innerHTML = "Get up to 21 and beat the dealer to win.<br>Current bet is $" + betvalue;
    document.getElementById('mybet').disabled = true;
    document.getElementById('maxbet').disabled = true;
    deal();
    document.getElementById('btndeal').style.display = 'none';
}

function deal() {                           //Function which deals the first two cards for the dealer and player.
    for (x = 0; x < 2; x++) {
        dealerCard.push(cards[cardCount]);
        dealerHolder.innerHTML += cardOutput(cardCount, x);
        if (x == 0) {
            dealerHolder.innerHTML += '<div id="cover" style="left:100px;"></div>';
        }
        redeal();
        playerCard.push(cards[cardCount]);
        playerHolder.innerHTML += cardOutput(cardCount, x);
        redeal();
    }
    var playervalue = CheckTotal(playerCard);
    if (playervalue == 21 && playerCard.length == 2) {
        playsEnd();
    }
    pValue.innerHTML = playervalue;
}

function redeal() {                            //Function to deal a new deck of cards when the cards reach a specific count here 50.
    cardCount++;
    if (cardCount > 50) {
        console.log("NEW DECK");
        shuffleD(cards);
        cardCount = 0;
        message.innerHTML = "New Shuffle";
    }
}

function Start() {
    shuffleD(cards);
    dealNew();
    document.getElementById('start').style.display = 'none';
    dollarValue.innerHTML = mydollars;
}

function cardOutput(n, x) {
    var hpos = (x > 0) ? x * 60 + 100 : 100;
    return '<div class="icard ' + cards[n].icon + '" style="left:' + hpos + 'px;">  <div class="top-card suit">' + cards[n].cardnum + '<br></div>  <div class="content-card suit"></div>  <div class="bottom-card suit">' + cards[n].cardnum +
        '<br></div> </div>';
}

function maxbet() {
    document.getElementById('mybet').value = mydollars;
    message.innerHTML = "Bet changed to $" + mydollars;
}

function cardAction(a) {                              //Function for the functionality of the three buttons hold, hit and double
    switch (a) {
        case 'hit':
            playsCard();
            break;
        case 'hold':
            playsEnd();
            break;
        case 'double':
            var betvalue = parseInt(document.getElementById('mybet').value);
            if ((mydollars - betvalue) < 0) {
                betvalue = betvalue + mydollars;
                mydollars = 0;
            } else {
                mydollars = mydollars - betvalue;
                betvalue = betvalue * 2;
            }
            document.getElementById('dollars').innerHTML = mydollars;
            document.getElementById('mybet').value = betvalue;
            playsCard();
            playsEnd();
            break;
        default:
            playsEnd();
    }
}

function playsCard() {                                //Function to add a new card in the player's hand
    playerCard.push(cards[cardCount]);
    playerHolder.innerHTML += cardOutput(cardCount, (playerCard.length - 1));
    redeal();
    var rValu = CheckTotal(playerCard);
    pValue.innerHTML = rValu;
    if (rValu > 21) {
        message.innerHTML = "BUSTED!!";
        playsEnd();
    }
}

function playsEnd() {
    endplay = true;
    document.getElementById('cover').style.display = 'none';
    document.getElementById('myactions').style.display = 'none';
    document.getElementById('btndeal').style.display = 'block';
    document.getElementById('mybet').disabled = false;
    document.getElementById('maxbet').disabled = false;
    message.innerHTML = "GAME OVER<br>";
    var payout = 1;
    var dealervalue = CheckTotal(dealerCard);
    dValue.innerHTML = dealervalue;
    while (dealervalue < 17) {
        dealerCard.push(cards[cardCount]);
        dealerHolder.innerHTML += cardOutput(cardCount, (dealerCard.length - 1));
        redeal();
        dealervalue = CheckTotal(dealerCard);
        dValue.innerHTML = dealervalue;
    }
    var playervalue = CheckTotal(playerCard);
    if (playervalue == 21 && playerCard.length == 2) {
        message.innerHTML = "Player BLACKJACK!!";
        payout = 1.5;
    }
    var betvalue = parseInt(document.getElementById('mybet').value) * payout;
    if ((playervalue < 22 && dealervalue < playervalue) || (dealervalue > 21 && playervalue < 22)) {
        message.innerHTML += '<span style="color:green;"> You WIN!<br>You won $' + betvalue + '</span>';
        mydollars = mydollars + (betvalue * 2);
    } else if (playervalue > 21) {
        message.innerHTML += '<span style="color:crimson;"> Dealer Wins!<br>You lost $' + betvalue + '</span>';
    } else if (playervalue == dealervalue) {
        message.innerHTML += '<span style="color:blue;"><br>PUSH</span>';
        mydollars = mydollars + betvalue;
    } else {
        message.innerHTML += '<span style="color:crimson;"> Dealer Wins!<br>You lost $' + betvalue + '</span>';
    }
    pValue.innerHTML = playervalue;
    dollarValue.innerHTML = mydollars;
}

function CheckTotal(arr) {                       //Function to check which total value and that which value is to be assigned to an ace.
    var rValue = 0;
    var aceAdjust = false;
    for (var i in arr) {
        if (arr[i].cardnum == 'A' && !aceAdjust) {
            aceAdjust = true;
            rValue = rValue + 10;
        }
        rValue = rValue + arr[i].cardvalue;
    }

    if (aceAdjust && rValue > 21) {
        rValue = rValue - 10;
    }
    return rValue;
}

function outputCard() {
    output.innerHTML += "<span style='color:" + cards[cardCount].bgcolor + "'>" + cards[cardCount].cardnum + "&" + cards[cardCount].icon + ";</span>  ";
}
