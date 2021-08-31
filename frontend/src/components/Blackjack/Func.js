import React, { useState, useEffect, useMemo } from 'react'
import Game from "./game"
import Card from "./Card"
import "./Blackjack.css"
import io from "socket.io-client"
import queryString from "query-string"
import {Link} from "react-router-dom";

//const game = new Game()
//console.log(game)

const ENDPOINT = "http://localhost:5000"
let socket

const Blackjack = ({location})=>{
    const game = useMemo(()=>{
        return new Game()
    }, [])
    const [gameState, setGameState] = useState(game)
    const [otherState, setOtherState] = useState(game)
    const [room, setRoom] = useState("")
    const [roomFull, setRoomFull] = useState(false)
    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState("")


    useEffect(()=>{
        const {room} = queryString.parse(location.search)
         
        socket = io.connect(ENDPOINT)

        setRoom(room)

        console.log(socket)

        socket.emit('join', {room: room}, (error) => {
            if(error)
               setRoomFull(true)
        })

        return function cleanup() {
            socket.disconnect()
            //shut down connnection instance
            socket.off()
        }
    },[location])
    

    useEffect(()=>{
        console.log(gameState)
        console.log(otherState)
        socket.on("roomData", ({ users }) => {
            setUsers(users)
        })

        socket.on('currentUserData', ({ name }) => {
            setCurrentUser(name)
        })

        socket.emit("initGameState", {
            gameState: otherState
        })

        socket.on("initGameState", ({gameState})=>{
            setOtherState(gameState)
        })
        
    },[gameState, otherState])

    const hitMe = () =>{
        gameState.hitMe()
        setGameState(gameState)
        setOtherState(gameState)
        socket.emit("updateGameState", {
            gameState: otherState
        })
    }

    const stay = () =>{
        gameState.stay()
        setGameState(gameState)
        setOtherState(gameState)
        socket.emit("updateGameState", {
            gameState: otherState
        })
    }

    const playerPoints = () =>{
        return(
            <div className="player">
                {`Player: ${otherState.players[1].points}`}
            </div>
        )
    }

    const dealerPoints = () =>{
        return(
            <div className="dealer">
                Dealer:  
                {otherState.currentPlayer===1? 
                <span> {otherState.players[0].points - otherState.players[0].hand[0].weight}</span>
                :
                <span> {otherState.players[0].points}</span>
                }
            </div>
        )
    }

    const nextRound = () =>{
        gameState.restartGame()
        setGameState(gameState)
        setOtherState(gameState)
        socket.emit("updateGameState", {
            gameState: otherState
        })
    }

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
                                {dealerPoints()}
                                    {playerPoints()}
                                </div>
                                {otherState.endOfRound ?
                                <>
                                    <div className="icon" onClick = {()=>{nextRound()}}>
                                        <div className="arrow">
                                            Next Round >
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    <button className="hit-me" onClick={()=>{hitMe()}} disabled={otherState.endOfRound}>Hit Me</button>
                                    <button className="stay" onClick = {()=>{stay()}} disabled={otherState.endOfRound}>Stay</button>
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
                                {dealerPoints()}
                                    {playerPoints()}
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
                                    <button className="hit-me" onClick={()=>{hitMe()}} disabled={otherState.endOfRound}>Hit Me</button>
                                    <button className="stay" onClick = {()=>{hitMe()}} disabled={otherState.endOfRound}>Stay</button>
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

export default Blackjack