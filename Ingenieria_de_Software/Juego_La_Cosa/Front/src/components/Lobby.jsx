import { useEffect, useState } from 'react';
import { socket } from './SocketConfig';
import Chat from './Chat';
import { startGame, getLobbyPlayers } from '../components/Endpoints';
import './Lobby.css';

function Lobby({ isHost, player, lobby, setLobby, onCompletion }) {
  const [serverResponse, setServerResponse] = useState('');
  const [players, setPlayers] = useState([]);

  const [incomingMessage, setIncomingMessage] = useState({ sender: '', data: '' }); //Mensaje a enviar
  const [chatMessages, setChatMessages] = useState([]);

  //TODO: Implementar chat
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Websocket ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  function parseLobbySocketMessage(message) {
    console.log('parsing lobby message');
    try {
      const data = message.split(',').map((item) => item.trim());
      var newPlayers = players;
      switch (data[0]) {
        case 'user_connect':
          // Add user to list. Format is: ''user_connect', user_name'
          //    newPlayers = [...players, data[2]];
          //    console.log('User '+data[2]+' has joined the lobby');
          //    setPlayers(newPlayers);
          getLobbyPlayers(lobby).then((players) => {
            const newPlayers = players.filter((element) => !element.host);
            setPlayers(newPlayers);
          });
          return;
        case 'user_disconnect':
          //    players.forEach((element) => { if (element !== data[2]) newPlayers.push(element) });
          //    console.log('User '+data[2]+' has left the lobby');
          //    setPlayers(newPlayers);
          getLobbyPlayers(lobby).then((players) => {
            const newPlayers = players.filter((element) => !element.host);
            setPlayers(newPlayers);
          });
          return;
        case 'chat_msg'://BC
          //Llega un mensaje de otro jugador. Format: 'case, <autor>, <msg>'
          if (data[1] !== player) {
            setIncomingMessage({
              sender: data[1],
              data: data[2]
            })
          }
          return;
        case 'game_start':
          console.log('Starting game');
          onCompletion();
          return;
        case 'lobby_close':
          console.log('Closing lobby');
          setLobby('');
          return;
        default:
          console.error('Invalid message type:', message);
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
      const message = { id: time_stamp, time: minutes, sender: incomingMessage.sender, data: incomingMessage.data };
      setChatMessages([...chatMessages, message]);
      setIncomingMessage({ sender: '', data: '' });
    }
  }, [incomingMessage])

  useEffect(() => {
    try {
      getLobbyPlayers(lobby).then((players) => {
        const newPlayers = players.filter((element) => !element.host);
        setPlayers(newPlayers);
      });
      socket.onmessage = (event) => {
        parseLobbySocketMessage(event.data);
      };
    } catch (error) {
      setServerResponse(error.message);
      console.error('Server-error:', error);
    }
  }, []);

  const iniciarParida = () => {
    if (isHost) {
      try {
        startGame(player, lobby).then((response) => {
          //console.log(response);
          //setServerResponse('response'); // TODO: 
        });
      } catch (error) {
        setServerResponse(error.detail);
        console.error('Server-error:', error);
      }
    }
  }
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Websocket ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  return (
    <div className='lobby-interface'>
      <h1 className='title-name'>{lobby}</h1>
      <div className='lobby-chat'>
        <Chat
          user_name={player}
          messageList={chatMessages}
          setIncomingMessage={setIncomingMessage}
        />
      </div>
      {/* Player list */}
      <div className='label-list'>
        <h2>Jugadores</h2>
        <div className='player_list'>
          {
            players.map((element) => (
              <div key={players.indexOf(element)}>{element.name}</div>
            ))
          }
        </div>
      </div>
      {/* Host start button */}
      {isHost && <button className='in-lobby-button' onClick={() => iniciarParida()}>Iniciar Partida</button>}
      {serverResponse && <p>{serverResponse}</p>}
    </div>
  );
}

export default Lobby;