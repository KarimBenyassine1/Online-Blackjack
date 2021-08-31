var SUITS= ["♠", "♣", "♥", "♦"];
var VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export default class Game{
    constructor(deck = createDeck(), players = createPlayers(), currentPlayer, winner, endOfRound){
        this.deck = deck
        this.players = players
        this.currentPlayer = currentPlayer
        this.winner = winner
        this.endOfRound = endOfRound
        
        this.startBlackJack()
    }

    get numberOfCards() {
        return this.deck.length
    }

    startBlackJack(){
        this.currentPlayer=1
        this.winner = ""
        this.endOfRound = false
        this.shuffle()
        this.dealCards()
        this.check()
    }

    shuffle(){
        // Shuffles cards randomly
        for(let i =this.numberOfCards-1; i>0; i--){
            const newIndex = Math.floor(Math.random()*(i+1))
            const temp = this.deck[newIndex]
            this.deck[newIndex] = this.deck[i]
            this.deck[i] = temp
        }
    }

    change(deck, players,currentPlayer, winner, endOfRound){
        this.deck = deck
        this.players = players
        this.currentPlayer = currentPlayer
        this.winner = winner
        this.endOfRound = endOfRound
    }

    dealCards(){
        // Makes sure that there is a total of 4 cards given in a round
        if(this.numberOfCards<4){
            this.deck = createDeck()
            this.shuffle()
        }

        //Gives each player two cards
        for(var j = 0; j<this.players.length; j++){
            for(var i = 0; i<2; i++){
                var newCard = this.deck.pop()
                if(newCard.value ==="A"){
                    this.players[j].hasAce = true
                    console.log(this.players)
                }
                if(i===0 && j===0){newCard.hidden=true}
                this.players[j].hand.push(newCard)
                this.players[j].points+=this.players[j].hand[i].weight
            }
        }
    }

    hitMe(){
        // New deck if deck ran out of cards
        if(this.numberOfCards===0){
            this.deck = createDeck()
            var allPlayerCards = this.players[0].hand.concat(this.players[1].hand)
            var filteredDeck = this.deck.filter(card => !allPlayerCards.includes(card))
            this.deck = filteredDeck
            this.shuffle()

        }

        // Adding card to player hand
        var prevHand = this.players[this.currentPlayer].hand
        var newCard = this.deck.pop()
        if(newCard.value ==="A"){this.players[this.currentPlayer].hasAce = true}
        this.players = this.players.map(el => 
            this.players.indexOf(el) === this.currentPlayer ? {...el, hand:[...prevHand, newCard]} : el)

        // Updating points
        var points = this.players[this.currentPlayer].points
        var length = this.players[this.currentPlayer].hand.length-1
        this.players = this.players.map(el => 
            this.players.indexOf(el) === this.currentPlayer ? {...el, points: points+this.players[this.currentPlayer].hand[length].weight}:el)
        
        // Changing Ace to value of 1 if hand goes over 21
        if(this.players[this.currentPlayer].points >21 && this.players[this.currentPlayer].hasAce){
            points = this.players[this.currentPlayer].points
            this.players = this.players.map(el => 
                this.players.indexOf(el) === this.currentPlayer ? {...el, points: points-10}:el)
            this.players[this.currentPlayer].hasAce = false
        }
        
        //checks result
        this.check()
    }

    stay(){
        //stops round for player
        if(this.currentPlayer===1){
            this.currentPlayer=0
            this.check()
            var prevHand = this.players[this.currentPlayer].hand

            //makes dealer's first card visible
            this.players = this.players.map(el => 
                this.players.indexOf(el) === 0? {...el, hand: prevHand.map(card => prevHand.indexOf(card)===0 ? {...card, hidden:false}:card)} : el)
        }else{
            this.endGame()
        }
    }

    check(){
        //Makes Ace to value of 1 if both cards are ace at the start of round
        if(this.players[this.currentPlayer].points > 21 && this.players[this.currentPlayer].hasAce){
            var points = this.players[this.currentPlayer].points
            this.players = this.players.map(el => 
                this.players.indexOf(el) === this.currentPlayer ? {...el, points: points-10}:el)
        }

        if(this.players[this.currentPlayer].points>21 || (this.currentPlayer===0 && this.players[0].points>this.players[1].points)){
            if(this.currentPlayer===1){
                this.currentPlayer=0
            }
            this.endGame()
        }else if (this.players[this.currentPlayer].points===21){
            this.endOfRound  = true
            this.winner = "Blackjack!"
        }
    }
    

    endGame(){
        console.log("finished round")
        var prevHand = this.players[0].hand
        this.endOfRound = true
        if(this.players[0].points>21){
            //player wins
            this.winner = this.players[1].role +" Wins!"
        }else if(this.players[1].points>21){
            // dealer wins
            this.players = this.players.map(el => 
                this.players.indexOf(el) === 0? {...el, hand: prevHand.map(card => prevHand.indexOf(card)===0 ? {...card, hidden:false}:card)} : el)
            this.winner = this.players[0].role +" Wins!"
        }else if(this.players[0].points>this.players[1].points){
            // dealer wins
            this.winner = this.players[0].role +" Wins!"
        }else if(this.players[0].points<this.players[1].points){
            // player wins
            this.winner = this.players[1].role + " Wins!"
        }else{
            this.winner ="Tie"
        }

    }
    
    restartGame(){
        // creates new round
        this.endOfRound = false
        this.currentPlayer=1
        this.winner = ""
        this.players = createPlayers()
        this.dealCards()
        this.check()
    }
}

function createPlayers(){
    // We want the creator of the game as the "Dealer" and the one who joins as the "Player"
    var players = []
    var roles = ["Dealer", "Player"]

    for(var i = 0; i<2; i++){
        var hand = []
        var player = {role: roles[i], ID: "pending",  points:0, hand: hand, hasAce : false}
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
