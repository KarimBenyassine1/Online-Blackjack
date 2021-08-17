var SUITS= ["♠", "♣", "♥", "♦"];
var VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export default class Game{
    constructor(deck = createDeck(), players = createPlayers()){
        this.deck = deck
        this.players = players
        

        this.shuffle()
    }

    get numberOfCards() {
        return this.deck.length
    }

    shuffle(){
        // shuffles cards randomly
        for(let i =this.numberOfCards-1; i>0; i--){
            const newIndex = Math.floor(Math.random()*(i+1))
            const temp = this.deck[newIndex]
            this.deck[newIndex] = this.deck[i]
            this.deck[i] = temp
        }
    }

}

function createPlayers(){
    // We want the creater of the game as the "Dealer" and the one who joins as the "Better"
    var players = []
    var roles = ["Dealer", "Better"]

    for(var i = 0; i<2; i++){
        var hand = 0
        var player = {role: roles[i], ID: "pending",  points:0,hand: hand}
        players.push(player)
    }

    return players
}

function createDeck(){
    //Initializing a standard 52 card deck and adding values seen in Blackjack
    var newDeck = []
    for(var i =0; i<VALUES.length; i++){
        for(var j=0; j<SUITS.length; j++){
            var weight = parseInt(VALUES[i])
            if (VALUES[i]==="J" || VALUES[i]==="Q" || VALUES[i]==="K"){
                weight = 10
            }else if (VALUES[i]==="A"){
                weight = 11
            }
            var card = {value: VALUES[i], suit:SUITS[j], weight: weight}
            newDeck.push(card)
        }
    }
    return newDeck
}
