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


    render() {
       const {gameState} = this.state
        return (
            <div>
                <div className="card-container">
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
