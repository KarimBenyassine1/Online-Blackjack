import React, { Component } from 'react'
import Game from "./game"
import Card from "./Card"
import "./Blackjack.css"
import io from "socket.io-client"
import queryString from "query-string"
import {Link} from "react-router-dom";

const ENDPOINT = "http://localhost:5000"
const socket = io.connect(ENDPOINT);

const game = new Game()
console.log(game)

export default class Blackjack extends Component {
    state = {
        gameState : game,
        otherState: game,
        room: "",
        roomFull: false,
        users : [],
        currentUser : ""
    }

    componentDidMount(){
        console.log(this.state.otherState)
        const {room} = queryString.parse(this.props.location.search)
         
        this.setState({room: room})

        socket.emit('join', {room: room}, (error) => {
            if(error)
               this.setState({roomFull: true})
        })

        socket.on("roomData", ({ users }) => {
            this.setState({users: users})
        })

        socket.on('currentUserData', ({ name }) => {
            this.setState({currentUser: name})
        })

        socket.emit("initGameState", {
            gameState: this.state.otherState
        })

        socket.on("initGameState", ({gameState})=>{
            console.log("recieved")
            this.state.gameState.change(gameState.deck, gameState.players, gameState.currentPlayer, gameState.winner, gameState.endOfRound)
            this.setState({otherState: gameState, gameState: this.state.gameState}, ()=>{ 
                console.log(this.state.otherState, this.state.gameState)
                socket.emit("updateGameState", {
                    gameState: this.state.otherState
                })

                socket.on("updateGameState",({gameState})=>{
                    this.state.gameState.change(gameState.deck, gameState.players, gameState.currentPlayer, gameState.winner, gameState.endOfRound)
                    this.setState({otherState: gameState, gameState: this.state.gameState})
                })
            })

        })



    }

    componentWillUnmount(){
        socket.disconnect()
        socket.off()
    }

    nextRound = () =>{
        this.state.gameState.restartGame()
        this.setState({gameState: this.state.gameState, otherState: this.state.gameState}, ()=>{
            socket.emit("updateGameState", {
                gameState: this.state.otherState
            })
            
            socket.on("updateGameState",({gameState})=>{
                this.state.gameState.change(gameState.deck, gameState.players, gameState.currentPlayer, gameState.winner, gameState.endOfRound)
                this.setState({otherState: gameState, gameState: this.state.gameState})
            })
        })
    }

    hitMe = () =>{
        this.state.gameState.hitMe()
        this.setState({gameState: this.state.gameState, otherState: this.state.gameState}, ()=>{
            socket.emit("updateGameState", {
                gameState: this.state.otherState
            })
            
            socket.on("updateGameState",({gameState})=>{
                this.state.gameState.change(gameState.deck, gameState.players, gameState.currentPlayer, gameState.winner, gameState.endOfRound)
                this.setState({otherState: gameState, gameState: this.state.gameState})
            })
        })
    }

    stay = () =>{
        this.state.gameState.stay()
        this.setState({gameState: this.state.gameState, otherState: this.state.gameState},()=>{
            socket.emit("updateGameState", {
                gameState: this.state.otherState
            })
            
            socket.on("updateGameState",({gameState})=>{
                this.state.gameState.change(gameState.deck, gameState.players, gameState.currentPlayer, gameState.winner, gameState.endOfRound)
                this.setState({otherState: gameState, gameState: this.state.gameState})
            })
        })

    }

    playerPoints = () =>{
        return(
            <div className="player">
                {`Player: ${this.state.otherState.players[1].points}`}
            </div>
        )
    }

    dealerPoints = () =>{
        return(
            <div className="dealer">
                Dealer:  
                {this.state.otherState.currentPlayer===1? 
                <span> {this.state.otherState.players[0].points - this.state.otherState.players[0].hand[0].weight}</span>
                :
                <span> {this.state.otherState.players[0].points}</span>
                }
            </div>
        )
    }

    render(){
       const {gameState, roomFull, users, room, currentUser, otherState} = this.state
        return (
            <div>
            {(!roomFull) ? 
                <>

                {users.length===1 && currentUser==="Dealer" &&
                    <div className="full">
                        <h1>Waiting for player to join...</h1>
                        <p style={{"marginTop": "15px"}}>{`Send player http link: http://localhost:3000/game?room=${room}`}</p>
                    </div>
                }
                
                {users.length===1 && currentUser==="Player" &&
                <div className="full">
                    <h1>Dealer has left the game...</h1>
                    <p style={{"marginTop": "15px"}}>{`Send player http link: http://localhost:3000/game?room=${room}`}</p>
                </div>
                }

                {users.length===2 && 
                <>
                    {/* DEALER VIEW */}
                    {currentUser==="Dealer" && 
                        <>
                            <div>
                                <div className="card-container-opponent">
                                    {otherState.players[1].hand.map(card=>{
                                        return(
                                                <Card card = {card} key={String(card.value)+card.suit}/>
                                        )
                                    })}
                                </div>
                                <div className="control-center">
                                    <div className="points">
                                    {this.dealerPoints()}
                                        {this.playerPoints()}
                                    </div>
                                    {otherState.endOfRound ?
                                    <>
                                        <div className="icon" onClick = {()=>{this.nextRound()}}>
                                            <div className="arrow">
                                                Next Round >
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                    {otherState.currentPlayer===1 ?
                                    <>
                                        <div className="turn-wait">Player's Turn...</div>
                                    </>
                                    :
                                    <>
                                        <button className="hit-me" onClick={()=>{this.hitMe()}} disabled={otherState.endOfRound}>Hit Me</button>
                                        <button className="stay" onClick = {()=>{this.stay()}} disabled={otherState.endOfRound}>Stay</button>
                                    </>
                                    }
                                    </>
                                    }
                                </div>
                                <div className="card-container-your">
                                    {otherState.players[0].hand.map(card=>{
                                        return(
                                                <Card card = {card} key={String(card.value)+card.suit}/>
                                        )
                                    })}
                                </div>
                                <div className="winner-state">
                                        {otherState.winner}
                                </div>
                            </div>
                        </>
                    }
                    
                     {/* PLAYER VIEW */}
                    {currentUser==="Player" && 
                        <>
                            <div>
                                <div className="card-container-opponent">
                                    {otherState.players[0].hand.map(card=>{
                                        return(
                                                <Card card = {card} key={String(card.value)+card.suit}/>
                                        )
                                    })}
                                </div>
                                <div className="control-center">
                                    <div className="points">
                                    {this.dealerPoints()}
                                        {this.playerPoints()}
                                    </div>
                                    {otherState.endOfRound ?
                                    <>
                                        <div className="icon">
                                            <div className="arrow">
                                                Waiting...
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                   {otherState.currentPlayer===1 ?
                                    <>
                                        <button className="hit-me" onClick={()=>{this.hitMe()}} disabled={otherState.endOfRound}>Hit Me</button>
                                        <button className="stay" onClick = {()=>{this.stay()}} disabled={otherState.endOfRound}>Stay</button>
                                    </>
                                    :
                                    <>
                                        <div className="turn-wait">Dealer's Turn...</div>
                                    </>
                                    }
                                    </>
                                    }
                                </div>
                                <div className="card-container-your">
                                    {otherState.players[1].hand.map(card=>{
                                        return(
                                                <Card card = {card} key={String(card.value)+card.suit}/>
                                        )
                                    })}
                                </div>
                                <div className="winner-state">
                                        {otherState.winner}
                                </div>
                            </div>
                        </>
                    }
                    </>
                }
                </>
            :

            <div className="full">
                <h1>Room Full</h1>
                <Link to={'/'}>
                    <button className="back-button">QUIT</button>
                </Link>
            </div>
            }
            </div>
        )
    }
}
