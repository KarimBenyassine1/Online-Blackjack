import React, { Component } from 'react'
import Game from "./game"

export default class Blackjack extends Component {

    state = {
        gameState : new Game()
    }


    componentDidMount(){
        console.log(this.state.gameState.deck)
    }

    render() {
        return (
            <div>
                Blacks
            </div>
        )
    }
}
