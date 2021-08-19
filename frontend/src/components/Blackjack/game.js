var SUITS= ["♠", "♣", "♥", "♦"];
var VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export default class Game{
    constructor(deck = createDeck(), players = createPlayers(), currentPlayer, winner, end){
        this.deck = deck
        this.players = players
        this.currentPlayer = currentPlayer
        this.winner = winner
        this.end = end
        
        this.startBlackJack()
    }

    get numberOfCards() {
        return this.deck.length
    }

    startBlackJack(){
        this.currentPlayer=0
        this.winner = ""
        this.end = false
        this.shuffle()
        this.dealCards()
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

    dealCards(){
        //Gives each player two cards
        for(var j = 0; j<this.players.length; j++){
            for(var i = 0; i<2; i++){
                var newCard = this.deck.pop()
                if(i===0 && this.currentPlayer===0){newCard.hidden=true}
                this.players[j].hand.push(newCard)
                this.players[j].points+=this.players[j].hand[i].weight
            }
        }
    }

    hitMe(){
        //adds another card to player
        if(this.deck.length===0){
            this.deck = createDeck()

        }

        var prevHand = this.players[this.currentPlayer].hand

        var newCard = this.deck.pop()
        this.players = this.players.map(el => 
            this.players.indexOf(el) === this.currentPlayer ? {...el, hand:[...prevHand, newCard]} : el)

        //this.players[this.currentPlayer].hand.push(newCard)

        var points = this.players[this.currentPlayer].points
        var length = this.players[this.currentPlayer].hand.length-1
        this.players = this.players.map(el => 
            this.players.indexOf(el) === this.currentPlayer ? {...el, points: points+this.players[this.currentPlayer].hand[length].weight}:el)
        
        //this.players[this.currentPlayer].points+=this.players[this.currentPlayer].hand[length].weight
    }

    stay(){
        //stops round for player
        var prevHand = this.players[this.currentPlayer].hand
        if(this.currentPlayer===0){
            this.currentPlayer++
            //this.players[0].hand[0].hidden=false
            this.players = this.players.map(el => 
                this.currentPlayer===0 ? {...el, hand: prevHand.map(card => prevHand.indexOf(card)===0 ? {...card, hidden:false}:card)} :el)
        }else{
            this.end()
        }
    }

    check(){
        if(this.players[this.currentPlayer]>21){
            this.end()
        }else if (this.players[this.currentPlayer]===21){
            this.end = true
            this.winner = this.players[this.currentPlayer].role
        }
    }
    
    end(){
        this.end = true
        if(this.players[0]>21){
            this.winner = this.players[1].role
        }else if(this.players[1]>21){
            this.winner = this.players[0].role
        }else if(this.players[0].points>this.players[1].points){
            this.winner = this.players[0].role
        }else if(this.players[0].points<this.players[1].points){
            this.winner = this.players[1].role
        }else{
            this.winner ="tie"
        }
        
        setTimeout(this.restartGame(), 3000);
    }

    
    restartGame(){
        for(var i = 0; i<2; i++){
            this.players[i].hand = []
        }

        this.dealCards()
    }
}

function createPlayers(){
    // We want the creater of the game as the "Dealer" and the one who joins as the "Better"
    var players = []
    var roles = ["Dealer", "Better"]

    for(var i = 0; i<2; i++){
        var hand = []
        var player = {role: roles[i], ID: "pending",  points:0, hand: hand}
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
            var card = {value: VALUES[i], suit:SUITS[j], weight: weight, hidden:false}
            newDeck.push(card)
        }
    }
    return newDeck
}
