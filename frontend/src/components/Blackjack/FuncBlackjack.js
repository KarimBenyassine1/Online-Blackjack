import React, {useState, useEffect} from 'react'
import Card from "./Card"
import "./Blackjack.css"
import io from "socket.io-client"
//import queryString from "query-string"
import shuffle from "../../utils/shuffle"

const ENDPOINT = "http://localhost:5000"
//const socket = io(ENDPOINT);

var SUITS= ["♠", "♣", "♥", "♦"]
var VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

var deck = []

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

deck = createDeck()

const FuncBlackjack = ()=> {

    const [room, setRoom] = useState("")
    const [roomFull, setRoomFull] = useState(false)
    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState("")
    const [players, setPlayers] = useState(createPlayers())
    const [winner, setWinner] = useState("")
    const [endOfRound, setEndOfRound] = useState(false)
    const[currentPlayer, setCurrentPlayer] =useState(1)

    useEffect(()=>{
        shuffle(deck)
        dealCards()
        console.log(deck)
    },[])

    /*
    useEffect(()=>{
        startBlackJack()

        const {room} = queryString.parse(this.props.location.search)
         
        setRoom(room)

        console.log(socket)

        socket.emit('join', {room: room}, (error) => {
            if(error)
               setRoomFull(true)
        })

        socket.on("roomData", ({ users }) => {
            setUsers(users)
        })

        socket.on('currentUserData', ({ name }) => {
            setCurrentUser(name)
        })
    },[])
    */

    const createPlayers =() =>{
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

    const dealCards = () =>{
        // Makes sure that there is a total of 4 cards given in a round
        if(deck.length<4){
            deck = createDeck()
        }

        var updatedPlayers = players

        //Gives each player two cards
        for(var j = 0; j<players.length; j++){
            for(var i = 0; i<2; i++){
                var newCard = deck.pop()
                if(newCard.value ==="A"){
                    updatedPlayers = updatedPlayers.map(el => updatedPlayers.indexOf(el) === j ? {...el, hasAce: true} : el)
                }
                if(i===0 && j===0){newCard.hidden=true}

                var prevHand = updatedPlayers[j].hand
                updatedPlayers = updatedPlayers.map(el => 
                    updatedPlayers.indexOf(el) === j ? {...el, hand:[...prevHand, newCard]} : el)
                
                var points = updatedPlayers[j].points
                var length = updatedPlayers[j].hand.length-1
                updatedPlayers = updatedPlayers.map(el => 
                    updatedPlayers.indexOf(el) === j ? {...el, points: points+updatedPlayers[j].hand[length].weight}:el)

            }
        }

        setPlayers([...updatedPlayers]) 
    }

    const hitMe = () =>{
        if(deck.length===0){
            deck = createDeck()
            var allPlayerCards = players[0].hand.concat(players[1].hand)
            var filteredDeck = deck.filter(card => !allPlayerCards.includes(card))
            deck = filteredDeck
            shuffle(deck)
        }
        var updatedPlayers = players

        // Adding card to player hand
        var prevHand = updatedPlayers[currentPlayer].hand
        var newCard = deck.pop()
        if(newCard.value ==="A"){
            updatedPlayers = updatedPlayers.map(el => updatedPlayers.indexOf(el) === currentPlayer ? {...el, hasAce: true} : el)
        }
        updatedPlayers = updatedPlayers.map(el => 
            updatedPlayers.indexOf(el) === currentPlayer ? {...el, hand:[...prevHand, newCard]} : el)

        var points = updatedPlayers[currentPlayer].points
        var length = updatedPlayers[currentPlayer].hand.length-1
        updatedPlayers = updatedPlayers.map(el => 
            updatedPlayers.indexOf(el) === currentPlayer ? {...el, points: points+updatedPlayers[currentPlayer].hand[length].weight}:el)

        if(updatedPlayers[currentPlayer].points > 21 && updatedPlayers[currentPlayer].hasAce){
            points = updatedPlayers[currentPlayer].points
            updatedPlayers = updatedPlayers.map(el => 
                updatedPlayers.indexOf(el) === currentPlayer ? {...el, points: points-10}:el)
                updatedPlayers[currentPlayer].hasAce = false
        }

        setPlayers([...updatedPlayers])
    }

    const stay = () =>{
        var updatedPlayers = players

        if(currentPlayer===1){
            setCurrentPlayer(0)
            var prevHand = updatedPlayers[0].hand
            updatedPlayers = updatedPlayers.map(el => 
                updatedPlayers.indexOf(el) === 0? {...el, hand: prevHand.map(card => prevHand.indexOf(card)===0 ? {...card, hidden:false}:card)} : el)
        }
        setPlayers(updatedPlayers)
    }

    const playerPoints = () =>{
        return(
            <div className="player">
                {`Player: ${players[1].points}`}
            </div>
        )
    }

    const dealerPoints = () =>{
        return(
            <div className="dealer">
                Dealer:  
                {currentPlayer===1? 
                <span> {players[0].points - players[0].hand[0].weight}</span>
                :
                <span> {players[0].points}</span>
                }
            </div>
        )
    }

    if(players.length!==0){
        return (
            <div>
                <div className="card-container-opponent">
                    {players[1].hand.map(card=>{
                        return(
                                <Card card = {card} key={String(card.value)+card.suit}/>
                        )
                    })}
                </div>
                <div className="control-center">
                    <div className="points">
                        {dealerPoints()}
                        {playerPoints()}
                    </div>
                    {endOfRound ?
                    <>
                    </>
                    :
                    <>
                        <button className="hit-me" onClick={()=>{hitMe()}} disabled={endOfRound}>Hit Me</button>
                        <button className="stay" onClick = {()=>{stay()}} disabled={endOfRound}>Stay</button>
                    </>
                    }
                </div>
                <div className="card-container-your">
                    {players[0].hand.map(card=>{
                        return(
                                <Card card = {card} key={String(card.value)+card.suit}/>
                        )
                    })}
                </div>
                <div className="winner-state">
                        {winner}
                </div>
            </div>
        )
    }
    return(<div>hi</div>)
}

export default FuncBlackjack