import React from 'react';
import { useState, useEffect } from 'react';
import { socket } from './components/SocketConfig';
import UserLogin from './components/UserLogin'
import CreateGame from './components/CreateGame'
import JoinGame from './components/JoinGame'
import Lobby from './components/Lobby'
import Game from './Game'
import './App.css';
import { leaveLobby } from './components/Endpoints';

function App() {
   const [name, setName] = useState('');
   const [lobby, setLobby] = useState('');
   const [isHost, setIsHost] = useState(false);
   const [isStarted, setIsStarted] = useState(false);

   const storeName = (data) => {
      sessionStorage.setItem('name', data)
      setName(data);
   };
   const storeLobby = (data) => {
      sessionStorage.setItem('lobby', data)
      setLobby(data);
   };
   const storeHost = (data) => {
      sessionStorage.setItem('host', data)
      setIsHost(data);
   };

   useEffect(() => {
      sessionStorage.clear();
      if (sessionStorage.getItem('name') !== '')
         setName(sessionStorage.getItem('name'));
      if (sessionStorage.getItem('lobby') !== '')
         setLobby(sessionStorage.getItem('lobby'));
      if (sessionStorage.getItem('host') !== false)
         setIsHost(sessionStorage.getItem('host'));
   },[]);

   return (
      <div className="App">
         {!name && <UserLogin
            className="UserLoginInterface"
            setName={storeName}
            handleCompletion={() => console.log('Success')} />}
         {!lobby && name &&
            <div className='join-create'>
               <div className='join-game'>
                  <h2>Unirse a Partida</h2>
                  <JoinGame
                     name={name}
                     setLobby={storeLobby}
                     handleCompletion={() => console.log('Success')} />
               </div>
               <h2 className='welcome'> {name ? `Hola ${name}!` : 'Por favor ingresa tu nombre'} </h2>
               <div className='create-game'>
                  <h2>Nueva partida</h2>
                  <CreateGame
                     className="CreateGameInterface"
                     host={name}
                     setLobby={storeLobby}
                     handleCompletion={() => {
                        console.log('Success');
                        storeHost(true);
                     }}
                     />
               </div>
               <button className="leave-button" 
                  onClick={() => {storeName(''); socket.close()}}>
                  Leave
               </button>
            </div>
         }
         {lobby && name && !isStarted &&
            <div>
               <Lobby
                  isHost={isHost}
                  player={name}
                  lobby={lobby}
                  setLobby={storeLobby}
                  onCompletion={() => { console.log('Success'); setIsStarted(true) }}
               />
               <button className="leave-button" 
                  onClick={() => {storeLobby('');leaveLobby(name, lobby)}}>
                  Leave
               </button>
            </div>
            }
         {lobby && name && isStarted &&
            <Game
               className="GameInterface"
               player_name={name}
               lobby_name={lobby}
               onCompletion={() => { storeLobby(''); setIsStarted(false) }}
            />
         }
      </div>
   );
}

export default App;