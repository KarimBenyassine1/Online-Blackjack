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

    render() {
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
