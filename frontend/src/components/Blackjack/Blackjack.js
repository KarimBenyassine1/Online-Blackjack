import React, { Component } from 'react'
import Game from "./game"
import Card from "./Card"
import "./Blackjack.css"
import io from "socket.io-client"
import queryString from "query-string"

const ENDPOINT = "http://localhost:5000"
const socket = io.connect(ENDPOINT);

export default class Blackjack extends Component {
    state = {
        gameState : new Game(),
        room: "",
        roomFull: false,
        users : [],
        currentUser : ""
    }

    componentDidMount(){
        console.log(this.state.gameState)
        const {room} = queryString.parse(this.props.location.search)
         

        this.setState({room: room})

        console.log(socket)

        socket.emit('join', {room: room}, (error) => {
            if(error)
               this.setState({roomFull: true})
        })

        socket.on("roomData", ({ users }) => {
            this.setState({users: users}, ()=>console.log(this.state.users))
        })

        socket.on('currentUserData', ({ name }) => {
            this.setState({currentUser: name}, ()=>console.log(this.state.currentUser))
        })
    }

    componentWillUnmount(){
        socket.emit("disconnect")
        socket.off()
    }


    hitMe = () =>{
        this.state.gameState.hitMe()
        this.setState({gameState: this.state.gameState}, ()=>console.log(this.state.gameState))
    }

    stay = () =>{
        this.state.gameState.stay()
        this.setState({gameState: this.state.gameState})
    }

    playerPoints = () =>{
        return(
            <div className="player">
                {`Player: ${this.state.gameState.players[1].points}`}
            </div>
        )
    }

    dealerPoints = () =>{
        return(
            <div className="dealer">
                Dealer:  
                {this.state.gameState.currentPlayer===1? 
                <span> {this.state.gameState.players[0].points - this.state.gameState.players[0].hand[0].weight}</span>
                :
                <span> {this.state.gameState.players[0].points}</span>
                }
            </div>
        )
    }

    nextRound = () =>{
        this.state.gameState.restartGame()
        this.setState({gameState: this.state.gameState})
    }

    render(){
       const {gameState} = this.state
        return (
            <div>
                <div className="card-container-opponent">
                    {gameState.players[1].hand.map(card=>{
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
                    {gameState.endOfRound ?
                    <>
                        <div className="icon" onClick = {()=>{this.nextRound()}}>
                            <div className="arrow">
                                Next Round >
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <button className="hit-me" onClick={this.hitMe} disabled={gameState.endOfRound}>Hit Me</button>
                        <button className="stay" onClick = {this.stay} disabled={gameState.endOfRound}>Stay</button>
                    </>
                    }
                </div>
                <div className="card-container-your">
                    {gameState.players[0].hand.map(card=>{
                        return(
                                <Card card = {card} key={String(card.value)+card.suit}/>
                        )
                    })}
                </div>
                <div className="winner-state">
                        {gameState.winner}
                </div>
            </div>
        )
    }
}
