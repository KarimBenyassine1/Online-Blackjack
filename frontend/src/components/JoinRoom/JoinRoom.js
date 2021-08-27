import React, {useState} from 'react'
import {Link} from "react-router-dom";

import "./JoinRoom.css"

const JoinRoom = () => {
    const [room, setRoom] = useState("")

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Welcome to Online Blackjack!</h1>
                <div>
                    <input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} />
                </div>
                <Link onClick={e => (!room) ? e.preventDefault() : null} to={`/game?room=${room}`}>
                    <button className={'button mt-20'} type="submit">Join!</button>
                </Link>
            </div>
        </div>
    )
}

export default JoinRoom
