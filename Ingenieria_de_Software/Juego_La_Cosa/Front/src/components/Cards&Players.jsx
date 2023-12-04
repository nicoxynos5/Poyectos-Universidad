import './Cards&Players.css'
import cartas from '../assets/cardsImg'

export function Card({ name = "Default title", id = 'Default id', onPlay, cardType }) {

  let cardIndex = cartas.findIndex((card) => card.name === name);

  if (cardIndex === -1) {
    cardIndex = 0;
  }

  return (
    <button className="card-button" onClick={() => { onPlay(id, cardType) }}>
      <img src={cartas[cardIndex].img} alt="Botón de Imagen" className='game-card-hand' />
    </button>
  );
};

export const Deck = ({ onIncrement }) => {
  return (
    <>
      <button className="boton-imagen" onClick={() => { onIncrement() }}>
        <img src={cartas[0].img} className='game-card' />
      </button>
      <h4 className='deck-text'>Mazo</h4>
    </>

  );
};

export const DiscardDeck = ({ onDiscard, discartedCardIndex}) => {

  return (
    <>
      <button className="boton-imagen" onClick={() => { onDiscard()}}>
        <img src={(discartedCardIndex < 0) ? cartas[0].img :cartas[discartedCardIndex].img} className='game-card' />
      </button>
      <h4 className='discard-text'>Descarte</h4>
    </>

  );
};

export function Player({ name = "Nombre por defecto", position = "Position", inGame, onInteraction, idElim, isObjective, quarantine }) { 
  return (
    <>  
      <button onClick={() => { (inGame && isObjective) ? onInteraction(idElim, name) : console.log(''); }} 
      className={(inGame && isObjective) ? "player-clickeable" : (quarantine>0 ? "quarantine-player" : "player")}
      >
        {name} <br /> Pos:{position}
      </button>
    </>
    
  )
};

export function DefendOrExchange ({defendMe, letsExchange, defendExchange, Def_or_Ex, skip}) {

  return(
    <div className='hand-buttons'>
          <button className="button-def"
          onClick={() => {(Def_or_Ex ?  defendExchange() : defendMe())}}>Defenderme</button> 
          {/*Defenderme se defiende de intercambiar o de una carta de acción*/}        
          <button className="button-skip"
          onClick={() => {Def_or_Ex ? letsExchange() : skip()}}>{Def_or_Ex ? "Intercambiar" : "No defenderme"}</button>
          {/*Se muestra un boton u otro dependiendo del tipo de evento, ambos implican no defenderse*/}
    </div>
  )
} 

export function Door ({}) {
  return(
    <div className='door'/>
  )
}
