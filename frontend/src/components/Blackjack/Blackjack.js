import React, { Component } from 'react'
import Game from "./game"
import Card from "./Card"
import "./Blackjack.css"

export default class Blackjack extends Component {

    state = {
        gameState : new Game()
    }

    componentDidMount(){
        console.log(this.state.gameState)
    }

    hitMe = () =>{
        this.state.gameState.hitMe()
        this.setState({gameState: this.state.gameState})
    }


    stay = () =>{
        this.state.gameState.stay()
        this.setState({gameState: this.state.gameState})
    }

    playerPoints = () =>{
        return(
            <div className="player">
                Player:  
                <span> {this.state.gameState.players[1].points}</span>
            </div>
        )
    }


    dealerPoints = () =>{
        return(
            <div className="dealer">
                Dealer:  
                {this.state.gameState.currentPlayer===1 ? 
                <span> {this.state.gameState.players[0].points - this.state.gameState.players[0].hand[0].weight}</span>
                :
                <span> {this.state.gameState.players[0].points}</span>
                }
            </div>
        )
    }

    render(){
       const {gameState} = this.state
        return (
            <div className="game">
                <div className="card-container-opponent">
                    {gameState.players[1].hand.map(card=>{
                        return(
                                <Card card = {card} key={String(card.value)+card.suit}/>
                        )
                    })}
                </div>
                <div className="control-center">
                    <button className="hit-me" onClick={this.hitMe}>Hit Me</button>
                    <div className="points">
                        {this.dealerPoints()}
                        {this.playerPoints()}
                    </div>
                    <button className="stay" onClick = {this.stay}>Stay</button>
                </div>
                <div className="card-container-your">
                    {gameState.players[0].hand.map(card=>{
                        return(
                                <Card card = {card} key={String(card.value)+card.suit}/>
                        )
                    })}
                </div>
            </div>
        )
    }
}
