import './Card.css'
import gameCards from '../assets/cardsImg'

function Card({name = "Default title",id='Default id', onPlay}) {

  let cardIndex = gameCards.findIndex((card) => card.name === name);

  if (cardIndex === -1) {
    cardIndex = 0;
  }

  return (
    <button className="card-button" onClick={() => {onPlay(id, cardIndex)}}>
      <img src = {gameCards[cardIndex].img} alt="Botón de Imagen" className='game-card-hand'/>
    </button>
  );
}

export default Card



