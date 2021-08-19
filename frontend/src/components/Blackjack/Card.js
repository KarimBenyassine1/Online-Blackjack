import React from 'react'
import "./Card.css"

const Card = ({card}) => {
    var color = (card.suit ==="♠" || card.suit ==="♣") ? "black" : "#FB0101" 

    return (
        <div className="card">
            <div className="value" style={{"color": color }}>{card.value} {card.suit}</div>
           <div className="big-suit" style={{"color": color }}>
                {card.suit}
           </div>
        </div>
    )
}

export default Card
