import './Game.css'
import { Card, Player, Deck, DiscardDeck, DefendOrExchange, Door } from './components/Cards&Players'
import Chat from './components/Chat'
import { socket } from './components/SocketConfig'
import cartas from './assets/cardsImg'
import {
   playCard, discardCard,
   stealCardFromDeck, getUserHand,
   getUserCardsInfo, getUsersPosition,
   notifyReady, defendExchange,
   defendPlay, defenseCard, swapCard, getUserRole
} from './components/Endpoints';
import { useState, useEffect } from 'react'

function Game({ player_name, lobby_name, onCompletion }) {

   const [ready, setReady] = useState(false);
   const [inGame, setInGame] = useState(false);               // Indica si hay una carta seleccionada
   const [cardDiscarted, setCardDiscarted] = useState(0);    // Carta para descartar
   const [cardElim, setCardElim] = useState(0);              // Carta que se esta por jugar
   const [end, setEnd] = useState([false, '', '']);            // Indica si el juego termino
   const [dead, setDead] = useState(false);                  // Indica si el jugador esta muerto

   // Nuevos estados
   const [gameState, setGameState] = useState("blocked");      // posibles estados: blocked, steal_card, discard_play, exchange, defend, defend_exchange.
   const [playerTurn, setPlayerTurn] = useState("none");       // Indica el nombre del jugador en turno.
   const [playerCards, setPlayerCards] = useState([]);         // Lista de cartas del jugador
   const [playersLeft, setPlayersLeft] = useState([]);         // Lista izquierda de jugadores en la partida
   const [playersRight, setPlayersRight] = useState([]);       // Lista derecha de jugadores en la partida
   /* const [cardType, setCardType] = useState(''); */

   const [userCardsInfo, setUserCardsInfo] = useState([]);      //Info de las cartas: Descartable, en quien se puede jugar
   const [cardObjectives, setCardObjectives] = useState([]);    //Arreglo que guarda los objetivos validos de una carta
   const [showDefOrEx, setShowDefOrEx] = useState(false);       //Bool para mostrar o no interfaz de intercambio y defensa
   const [isDefenseOrExchange, setIsDefenseOrExchange] = useState(false); //Me aplicaron carta de acción o de intercambio, false acción, true Exchange
   const [exchangeObjective, setExchangeObjective] = useState(''); //Objetivo delintercambio

   const [userRole, setUserRole] = useState('undef'); //Rol del jugador

   const [gameTurnDirection, setGameTurnDirection] = useState(true) //True = turno ascendente, False = turno descendente
   //TODO: Implementar chat desde lobby
   const [incomingMessage, setIncomingMessage] = useState({ sender: '', data: '' }); //Mensaje a enviar
   const [chatMessages, setChatMessages] = useState([]);
   const [systemMessages, setSystemMessages] = useState([]);
   const [chatOrSystem, setChatOrSystem] = useState(false); //True = chat, False = system

   // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Websocket ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   function parseGameSocketMessage(message) {
      console.log('parsing game message');
      console.log(message);
      try {
         const data = message.split(',').map((item) => item.trim());
         switch (data[0]) {
            //DM: mensaje particular a un jugador
            //BC: mensaje a todos los jugadores en partida
            //Las referencias a jugadores se refieren al nobre de estos. 
            // Ej <turn_user> == "user in turn name"
            //Los parametros entre parentesis son un parametro opcional. Ej (card_name)
            case 'chat_msg'://BC
               //Llega un mensaje de otro jugador. Format: 'case, <autor>, <msg>'
               if (data[1] !== player_name) {
                  setIncomingMessage({
                    system: false, 
                    sender: data[1],
                    data: data[2]
                  })
               }
               return;
            case 'card_swap'://BC
               // Jugador 1 intercambio una carta con el Jugador 2. Format: 'case, <user1>, <user2>, (card)'
               // Cuando lo tengamos avisarlo por chat
               setIncomingMessage({
                  system: true,
                  sender: 'System',
                  data: `Ha ocurrido un intercambio entre ${data[1]} y ${data[2]} ${data[3] ? `de la carta ${data[3]}` : ''}`
               })
               if (data[1] == player_name || data[2] == player_name) {
                  getUserHand(player_name, lobby_name).then((data) => {
                     setPlayerCards(data);
                  });
               }
               getUserRole(player_name, lobby_name).then((data) => {
                  if (data === 'Infectado' && data !== userRole && userRole !== 'undef') {
                     setIncomingMessage({
                        system: true,
                        sender: 'System',
                        data: `Ha ocurrido un cambio en tu rol, ahora eres ${data}`
                     })
                  }
                  setUserRole(data);
               });
               return;
            case 'steal_card'://BC
               // Un jugador robo una carta. Format: 'case, <user_name>, (card_name)'
               //Cuando lo tengamos avisarlo por chat
               console.log(data);
               if (data[1] == player_name) {
                  getUserHand(player_name, lobby_name).then((data) => {
                     console.log(data);
                     setPlayerCards(data);
                  });
               }
               setIncomingMessage({
                  system: true,
                  sender: 'System',
                  data: `El jugador ${data[1]} ha robado ${data[2] ? `la carta ${data[2]}` : 'una carta'}`
               });
               return;
            case 'play_card'://BC
               // Un jugador jugo una carta. Format: 'case, <turn_user>, <target_user>, <effect>'
               //Carta sin objetivo => turn_user == target_user
               //Cuando lo tengamos avisarlo por chat
               if (data[3] === "Vigila tus espaldas") {
                  setIncomingMessage({
                     system: true,
                  sender: 'System',
                     data: `El jugador ${data[1]} ha jugado sobre ${data[2]} la carta ${data[3]}, el orden de juego cambio `
                  });
               } else {
                  setIncomingMessage({
                     system: true,
                  sender: 'System',
                     data: `El jugador ${data[1]} ha jugado sobre ${data[2]} la carta ${data[3]}`
                  });
               }

               if ((data[3] === "Lanzallamas") && (data[2] === player_name)) {
                  setDead(true);
                  console.log(dead);
               } else if (data[3] === "Vigila tus espaldas") {
                  setGameTurnDirection(!gameTurnDirection);
               }

               getPlayers();
               setCardDiscarted(cartas.findIndex((card) => card.name === data[3]));

               return;
            case 'discard_card'://BC
               // Un jugador descarto una carta. Format: 'case, <user_name>, (card_name)' 
               //Cuando lo tengamos avisarlo por chat
               if (data[1] == player_name) {
                  getUserHand(player_name, lobby_name).then((data) => {
                     console.log(data);
                     setPlayerCards(data);
                  });
               }
               setCardDiscarted(0);
               setIncomingMessage({
                  system: true,
                  sender: 'System',
                  data: `El jugador ${data[1]} ha descartado ${data[2] ? `la carta ${data[2]}` : 'una carta'}`
               });
               return;
            case 'defense_play'://BC
               // Un jugador se defendio. Format: 'case, <user>'
               //Cuando lo tengamos avisarlo por chat
               setIncomingMessage({
                  system: true,
                  sender: 'System',
                  data: `El jugador ${data[1]} se ha defendido`
               });
               if (data[1] === player_name) {
                  getUserHand(player_name, lobby_name).then((data) => {
                     setPlayerCards(data);
                  });
               };
               return;
            case 'turn'://BC
               // Player turn. Format: 'case, <user_name>
               setIncomingMessage({
                  system: true,
                  sender: 'System',
                  data: `Es el turno de ${data[1]}`
               })
               setPlayerTurn(data[1]);
               if (data[1] !== player_name) {
                  setGameState("blocked");
               }
               getPlayers();
               return;
            case 'waiting_for_exchange'://DM
               // El jugador en turno espera la respuesta del intercambio. Format: 'case'
               setGameState("blocked");
               return;
            case 'steal_after_defend'://DM
               // El jugador debe robar luego de defenderse. Format: 'case'
               //setGameState("steal_card");
               setGameState('defense_steal');
               return;
            case 'steal_after_exchange'://DM
               // El jugador debe robar luego de defenderse. Format: 'case'
               //setGameState("steal_card");
               setGameState('defense_steal');
               return;
            case 'finish_exchange'://DM
               // Segunda parde del intercambio. Format: 'case, <start_user>'
               setGameState("exchange");
               setExchangeObjective(data[1]);
               return;
            case 'defend_or_exchange'://DM
               // El jugador acepta intercambiar o se defiende. Format: 'case'
               setGameState("defend_exchange");
               setShowDefOrEx(true);
               setIsDefenseOrExchange(true);
               return;
            case 'turn_ended'://DM
               // Termino el turno del Jugador. Format: 'case'
               setGameState("blocked");
               return;
            case 'steal_card_stage'://DM
               // Empieza la etapa robar carta. Format: 'case'
               // En nuestro caso es la misma que play ???
               // if card field !== 'null' card is shown to table
               setGameState('steal_card');
               return;
            case 'discard_or_play'://DM
               // El jugadpr elige jugar o descartar una carta. Format: 'case' 
               setGameState('discard_play');
               getUserCardsInfo(lobby_name, player_name).then((data) => {
                  console.log(data);
                  setUserCardsInfo(data);
               });
               return;
            case 'play_panic'://DM
               // El jugador debe jugar la carta de panico. Format: 'case' 
               setGameState('panic');
               getUserCardsInfo(lobby_name, player_name).then((data) => {
                  console.log(data);
                  setUserCardsInfo(data);
               });
               return;
            case 'steal_after_panic'://DM
               // El debe robar despues de jugar una carta de panico. Format: 'case'
               setGameState('steal_card');
               return;
            case 'discard_after_panic'://DM
               setGameState('discard_panic');
               return;
            case 'defend_or_skip'://DM
               // El jugador elige defenderse o no. Format: 'case, <turn_user>'
               // Para cartas de acción
               setGameState("defend_skip");
               setShowDefOrEx(true);
               setIsDefenseOrExchange(false);
               return;
            case 'waiting_target_defense'://DM 
               // El jugador espera a que su objetivo se defienda. Format: 'case'
               setGameState("blocked");
               return;
            case 'game_over'://BC
               // Termino la partida. Format: 'case'         
               //usar handleEndGame
               setIncomingMessage({
                  system: true,
                  sender: 'System',
                  data: "El juego ha terminado"
               })
               return;
            case 'defend_play'://DM
               //Empieza la etapa en la que el jugador elige con que carta defenderse
               //Format: 'case, <user_turn>, <effect_to_be_applied>'
               setGameState("defend");
               return;
            case 'whisky'://BC
               //El Jugador muestra todas sus cartas
               //Format: 'case, <user>, <card1>, <card2>, <card3>, <card4>'
               var cards = data[2];
               for (var i = 3; i < data.length; i++) {
                  cards = cards + ', ' + data[i];
               }
               setIncomingMessage({
                  system: true,
                  sender: 'System',
                  data: `El jugador ${data[1]} muestra sus cartas: ${cards}`
               })
               return;
            case "aterrador":
               //Defensa de inctercambio con muestra de carta
               //Format: 'case, <user>, <card>'
               setIncomingMessage({
                  system: true,
                  sender: 'System',
                  data: `El jugador ${data[1]} ha intentado intercambiar la carta ${data[2]}`
               })
               return;
            case 'sospecha'://DM 
               // El jugador espera a que su objetivo se defienda. Format: 'case, <target_name>, <card_seen>'
               setIncomingMessage({
                  system: true,
                  sender: 'System',
                  data: `Has jugado Sospecha sobre ${data[1]} y la carta que has visto es ${data[2]}`
               })
               return;
            case 'analisis'://DM
               //El Jugador muestra todas sus cartas
               //Format: 'case, <user>, <card1>, <card2>, <card3>, <card4>'
               var cards = data[2];
               for (var i = 3; i < data.length; i++) {
                  cards = cards + ', ' + data[i];
               }
               setIncomingMessage({
                  system: true,
                  sender: 'System',
                  data: `El jugador ${data[1]} tiene las cartas: ${cards}`
               })
               return;
            case 'start_exchange'://DM
               // Comenzo la etapa de intercambio. Format: 'case, <objetive>'
               setGameState("exchange");
               setExchangeObjective(data[1]);
               return;
            case 'defend_exchange'://DM
               //Empieza la etapa en la que el jugador elige con que carta defenderse
               //Format: 'case, <user_turn>, <effect_to_be_applied>'
               setGameState("defend");
               return;
            case 'winners'://BC
               // Los ganadores son... . Format: 'case, <team>, <winners>'
               //Cuando lo tengamos avisarlo por chat
               //O añadir texto a la UI o ponerlo donde va el nombre de partida en otro color
               setIncomingMessage({
                  system: true,
                  sender: 'System',
                  data: `Han ganado: ${data[1]}`
               });
               console.log(data.length)
               setEnd([true, data[1], data[2]]);
               return;
            case 'superinfection':
               // Un jugador se defendio. Format: 'case, <user>'
               if (data[1] === player_name) {
                  onCompletion();
               }
               return;
            case 'user_disconnect_in_game':
               // BC Format: 'case, <user>'
               setIncomingMessage({
                  system: true,
                  sender: 'System',
                  data: `El jugador ${data[1]} se ha desconectado`
               });
               onCompletion();
               return;
            default:
               console.error('Invalid message type:', data[0], ' - ', message);
               return;
         }
      } catch (error) {
         console.error('Error parsing message:', error);
      }
   }

   useEffect(() => {
      if (incomingMessage.data !== '') {
         const d = new Date();
         const minutes = ("0"+d.getHours()).slice(-2) + ":" + ("0"+d.getMinutes()).slice(-2);
         const time_stamp = d.getTime();
        if(incomingMessage.system){
            const message = { id: time_stamp, time: minutes, sender: '', data: incomingMessage.data };  
            setSystemMessages([...systemMessages, message]);
        }
        else {
            const message = { id: time_stamp, time: minutes, sender: incomingMessage.sender, data: incomingMessage.data };  
            setChatMessages([...chatMessages, message]);
        }
         setIncomingMessage({ system:false, sender: '', data: '' });
      }
   }, [incomingMessage])

   useEffect(() => {
      socket.onmessage = (event) => {
         parseGameSocketMessage(event.data);
      };
      if (!ready) {
         notifyReady(player_name, lobby_name).then(() => {
            setReady(true);
         })
      }
   }, []);

   // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Función para jugar una carta ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   const handlePlayCard = async (card_elim, objective_player) => {
      // Avisa al back que se jugo una carta
      playCard(player_name, lobby_name, card_elim, objective_player)
         .then(() => {
            /* setCardDiscarted(card_elim); */
         })
         .catch((error) => {
            console.error("Error: ", error);
         })
      // Actualiza la mano del jugador y cambia el turno
   }

   // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Función para seleccionar una carta ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   const handleClickOnCard = async (idCard, typeOfClickedCard) => {
      //Función para cuando se hace click en una carta de la mano del jugador
      //Dependiendo del gameState puede ser para selelcionar carta a jugar, descartar, intercambiar o para defenderse 
      const length = playerCards.length
      if ((gameState === 'discard_play') || (gameState === 'discard_panic') || (gameState === 'panic') && length > 4) {
         try {
            setCardElim(idCard);
            getObjectives(idCard, typeOfClickedCard);
            setInGame(true);
         } catch {
            setInGame(false);
            setCardElim(0);
         }
      } else if ((gameState === 'exchange') && length == 4) {
         swapCard(player_name, lobby_name, exchangeObjective, idCard);
      } else if (gameState === "defend") {
         defenseCard(player_name, lobby_name, idCard)
            .catch((error) => {
               console.error("Error: ", error);
            });
         const newPlayerCards = playerCards.filter((card) => card.id !== cardElim);
         setPlayerCards(newPlayerCards);
      }
   }

   // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Función para obtener los objetivos de las cartas ~~~~~~~~~~~~~~~~~~~~~
   const getObjectives = async (idCard, typeOfClickedCard) => {
      //Para la carta con al id = "idCard" devuelve que jugadores son un objetivo valido
      //dependiendo del gameState (busca la carta idcard en la info de cartas)
      if (gameState === 'panic' && typeOfClickedCard == 'Panico') {
         const foundCard = userCardsInfo.find((card) => card.card_id === idCard);
         console.log('card selected: ', foundCard);
         setCardObjectives([...foundCard.valid]);
      } else if (gameState === 'discard_play') {
         const foundCard = userCardsInfo.find((card) => card.card_id === idCard);
         console.log('card selected: ', foundCard);
         setCardObjectives([...foundCard.valid]);
      } else {
         setCardObjectives([]);
      }


      return idCard;
   }

   // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Función para robar una carta del mazo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


   const handleDeck = async () => {
      /* const length = playerCards.length; */
      if ((gameState === 'steal_card') || (gameState === 'defense_steal') && playerCards.length < 5) {
         try {
            // Realiza la solicitud para robar una carta del mazo
            //if(playerCards.length < 5){
            stealCardFromDeck(player_name, lobby_name).then((data) => {
               getUserHand(player_name, lobby_name).then((data) => {
                  setPlayerCards(data);
               });
            });
            //console.log('Respuesta:', data);
         } catch (error) {
            console.error("Error: ", error);
         }
      }
      if ((gameState === 'defense_steal')) {
         setGameState("blocked");
      }
   }

   // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Función para descartar una carta ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

   const handleClickOnDiscardDeck = async () => {
      const foundCard = userCardsInfo.find((card) => card.card_id === cardElim);
      if ((gameState === "discard_play") || (gameState === 'discard_panic') && (foundCard.discard)) {
         try {
            // Realiza la solicitud para descartar una carta
            discardCard(player_name, lobby_name, cardElim);
            setInGame(false);
            //console.log('Respuesta:', data);
         } catch (error) {
            console.error("Error: ", error);
         }
         // Actualiza la mano del jugador y cambia el turno
         //setCardDiscarted(cardTmp);
         //setIsTurn(false);
      }
   }

   // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Función para seleccionar un objetivo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   const handleClckOnPlayer = (card_elim, name_player_objective) => {
      const length = playerCards.length
      console.log(gameState);
      if (length > 4 && (gameState === "discard_play") || (gameState === 'panic')) {
         handlePlayCard(card_elim, name_player_objective).then(() => {
            const newPlayerCards = playerCards.filter((card) => card.id !== cardElim);
            setPlayerCards(newPlayerCards);
            setInGame(false);
         })
         // Jugar la carta en un objetivo
      }
   }

   // ~~~~~~~~~~~~~~~~~~~~~~~~~ Función elegir defenderse de Acción ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   const handleDefense = () => {
      //Avisar que el Jugador se defendera al back
      setShowDefOrEx(false);
      defendPlay(player_name, lobby_name, true);
   }

   const handleSkip = () => {
      setShowDefOrEx(false);
      setGameState("blocked");
      defendPlay(player_name, lobby_name, false);
      //Avisar que el Jugador no se defendera al back
   }

   // ~~~~~~~~~~~~~~~~~~~~~~~ Función para defenderse de Intercambio ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   const handleDefenseExchange = () => {
      setShowDefOrEx(false);
      defendExchange(player_name, lobby_name, true);
      //Avisar que el Jugador acepta el intercambio al back
   }

   const handleAcceptExchange = () => {
      setShowDefOrEx(false);
      //setGameState("exchange")
      defendExchange(player_name, lobby_name, false);
      //Avisar que el Jugador acepta el intercambio al back
   }

   // ~~~~~~~~~~~~~~~~~~~~~ Obtener la mano del jugador al cargar el componente ~~~~~~~~~~~~~~~~~~~~~~~
   useEffect(() => {
      getUserHand(player_name, lobby_name)
         .then(data => {
            //console.log('Respuesta:', data);
            setPlayerCards(data);
         })
         .catch(error => {
            console.error('Error:', error);
         });
   }, []);

   // ~~~~~~~~~~~~~~~~~~~~~~ Obtener la Lista de Jugadores al cargar el componente ~~~~~~~~~~~~~~~~~~~~~~~~~~~
   useEffect(() => {
      getUserRole(player_name, lobby_name).then((data) => {
         setUserRole(data);
      })
      getPlayers();
   }, []);

   function getPlayers() {
      getUsersPosition(lobby_name)
         .then(players => {
            //console.log('Respuesta:', players);
            //Función que consigue las posiciones, nombres, des los jugadores
            //así como las puertas atrancadas y cuarentenas presentes 
            const length = players.length;
            const mid = Math.floor(length / 2);
            let myPlayersRight = updatePlayersRight(players.slice(mid, length))
            let myPlayersLeft = updatePlayersLeft(players.slice(0, mid));

            setPlayersLeft(myPlayersLeft)
            setPlayersRight(myPlayersRight)
         })
         .catch(error => {
            console.error('Error:', error);
         });
   }

   function updatePlayersLeft(players) {
      let newPlayers = players.sort((a, b) => b.position - a.position);
      return newPlayers;
   }

   function updatePlayersRight(players) {
      let newPlayers = players.sort((a, b) => a.position - b.position);
      return newPlayers;
   }

   function parseStage(stage) {
      //Mensaje que se le muestra al jugador por pantalla
      //para indicarle en que estapa del turno se encunetra
      if (stage === "steal_card") {
         return ("Roba una carta");
      } else if (stage === "blocked") {
         return ("Esperando...");
      } else if (stage === "defend") {
         return ("Defiendete");
      } else if (stage === "discard_play") {
         return ("Juega o descarta una carta");
      } else if (stage === "exchange") {
         return ("Intercambia");
      } else if (stage === "panic") {
         return ("Juega la carta de panico");
      }
      else {
         return (stage.replace('_', ' '));
      }
   }

   return (
      <div id="container">

         <h2 className='game-name'>Partida: {lobby_name} 🃏 Jugador: {player_name} 🃏 Rol: {userRole}</h2>

         <div className='players-left'>
            <h2 className='title-text'>Jugadores</h2>
            <ol className='list'>
               {
                  playersLeft.map(({ name, position, left_door, quarantine }, index) => (   //! Cuando este disponible del back
                     <>

                        <Player
                           className="playersLeft"
                           key={index}
                           onInteraction={handleClckOnPlayer}
                           inGame={inGame}
                           name={name}
                           position={position}
                           idElim={cardElim}
                           quarantine={quarantine}
                           isObjective={cardObjectives.includes(name)}
                        />
                        {left_door ? (<Door key={index} />) : (<></>)}
                     </>
                  ))
               }

            </ol>
         </div>

         <section id="content">
            <Deck onIncrement={handleDeck} />
            <DiscardDeck onDiscard={handleClickOnDiscardDeck} discartedCardIndex={cardDiscarted} />
            <div className='turn'>
               {((gameState === 'blocked') && !(playerTurn === player_name)) ? <h3>Turno de {playerTurn}</h3> : <h3>{parseStage(gameState)}</h3>}
            </div>
         </section>

         <div className='players-right'>
            <h2 className='title-text'>Jugadores</h2>
            <ol className='list'>
               {
                  playersRight.map(({ name, position, left_door, quarantine }, index) => (
                     <>
                        {left_door ? (<Door key={index} />) : (<></>)}
                        <Player
                           className="playersLeft"
                           key={index}
                           onInteraction={handleClckOnPlayer}
                           inGame={inGame}
                           name={name}
                           position={position}
                           idElim={cardElim}
                           quarantine={quarantine}
                           isObjective={cardObjectives.includes(name)}
                        />
                     </>
                  ))
               }
            </ol>
         </div>

         <div className='player-hand'>
            {showDefOrEx && <DefendOrExchange
               defendExchange={handleDefenseExchange}
               letsExchange={handleAcceptExchange}
               defendMe={handleDefense}
               skip={handleSkip}
               Def_or_Ex={isDefenseOrExchange} />}
            {
               playerCards.map(({ name, id, type }) => (
                  <Card
                     key={id}
                     name={name}
                     id={id}
                     onPlay={handleClickOnCard}
                     cardType={type} />
               ))
            }
         </div>
         <div>
         { end[0] && !dead &&
            <dialog open className='winners_modal'>
               <h2>👾 ¡El juego ha terminado! 👾</h2>
               <p>El equipo {end[1]} ha ganado!</p>
               <p>Felicitaciones {end[2]}</p>
               <button className='end-button' onClick={() => onCompletion()}>Cerrar</button>
            </dialog>
         }
         { dead &&
            <dialog open className='dead_modal'>
               <h2>💀 ¡Has muerto! 💀</h2>
               <p> 🔥 Te eliminaron con un lanzallamas 🔥</p>
               <button className='end-button' onClick={() => onCompletion()}>Cerrar</button>
            </dialog>
         }

         </div>
         <div className='chat-system'>
            <button onClick={() => {setChatOrSystem(!chatOrSystem)}}>{chatOrSystem ? "System" : "Chat"}</button>
            { chatOrSystem ? 
            <div className='chat'>
                <Chat
                    user_name={player_name}
                    messageList={chatMessages}
                    setIncomingMessage={setIncomingMessage}
                />
            </div> :
            <div className='system'>
               <Chat
                  user_name={player_name}
                  messageList={systemMessages}
                  setIncomingMessage={() => {}}
               />
            </div>}
        </div> 
         {/*<button className='end-button' onClick={() => handleEndGame()}>Terminar</button> */}
      </div>
   );
}

export default Game;