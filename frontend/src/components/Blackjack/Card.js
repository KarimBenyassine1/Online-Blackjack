import React from 'react'
import "./Card.css"

const Card = ({card}) => {
    return (
        <div className="card">
           <div className="big-suit">
                {card.suit}
                {card.value}
           </div>
        </div>
    )
}

export default Card
