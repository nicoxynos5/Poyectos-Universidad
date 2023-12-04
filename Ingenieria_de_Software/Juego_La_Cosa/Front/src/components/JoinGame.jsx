import { set, useForm } from 'react-hook-form'
import { startWebsocket, socket } from './SocketConfig'
import { useEffect, useState } from 'react'
import { joinLobby, getJoinableLobbies } from '../components/Endpoints'
import './JoinGame.css'

export default function JoinGame({ name, setLobby, handleCompletion}) {
   const [serverResponse, setServerResponse] = useState('');
   const [lobbyListing, setLobbyListing] = useState([]);
   const [password, setPassword] = useState('');

   // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Websocket ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  
   function parseListingSocketMessage(message) {
      console.log('parsing listing message');
      var newLobbyListing = lobbyListing;
      try {
         const data = message.split(',').map((item) => item.trim());
         switch (data[0]) {
            case 'new_lobby':
               // Event: lobby is created
               // Add lobby to listing. Format is: 'new_lobby, lobby_name, numer_of_players, max_players, is_private'
               //    const element = `{"name":"${data[1]}", "total_players":${data[2]},"max_players":${data[3]}, "secure":true}`
               //    setLobbyListing([...newLobbyListing, JSON.parse(element)]);
               getJoinableLobbies().then((data) => {
                  setLobbyListing(data);
               });
               return;
            case 'update_players':
               // Event: player joins or leaves lobby
               // Update players in lobby. Format is: ''update_players', lobby_name, number_of_players'
               // If number_of_players is max, set to full
               //    newLobbyListing.forEach((lobby) => {
               //      if (lobby.name === data[1]) {
               //        lobby.total_players = data[2];
               //      }
               //    })
               //    setLobbyListing(newLobbyListing);
               getJoinableLobbies().then((data) => {
                  setLobbyListing(data);
               });
               return;
            case 'lobby_close':
               // Lobby is closed or started
               // Remove lobby from listing. Format is: ''lobby_close', lobby_name'
               //    newLobbyListing = newLobbyListing.filter((lobby) => lobby.name !== data[1]);
               //    setLobbyListing(newLobbyListing);
               getJoinableLobbies().then((data) => {
                  setLobbyListing(data);
               });
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
      if (!socket && name) {
         startWebsocket(name);
      }
   },[name]);
   
   useEffect(() => {
      try {
         getJoinableLobbies().then((data) => {
            setLobbyListing(data);
         });
         socket.onmessage = (event) => {
            parseListingSocketMessage(event.data);
         };
      } catch (error) {
         setServerResponse(error.message);
         console.error('Server-error:', error);
      }
   }, []);

   // Function to handle the form submission
   const onSubmit = async (input_data) => {
      try {
         const password = input_data.password === '' ? 'empty' : input_data.password;
         const response = await joinLobby(input_data.lobby, name, password);
         setServerResponse(response.message);
         setLobby(input_data.lobby)
         handleCompletion();
      }
      catch (error) {
         // Maneja los errores de la solicitud aquí
         setServerResponse(error.message);
         console.error('Server-error:', error);
      }
   }
   // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Websocket ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

   return (
      <div className='join-container' name='join-container'>
         <ol className='list-container'> 
            {
               lobbyListing.map((lobby, index) => {
                  return (
                     <>
                     <button key={index}
                        className='lobby-button'
                        onClick={() => onSubmit({ lobby: lobby.name, password: password })}
                     >
                        {lobby.name}
                     </button>
                     <button key={lobbyListing.indexOf(lobby) + 'players'}
                        className='player-count'
                        onClick={() => onSubmit({ lobby: lobby.name, password: password })}
                     >
                        {lobby.total_players}/{lobby.max_players}
                     </button>
                     </>
                  );
               })
            }
         </ol>
         <>
            <label className='password-label'>Contraseña:</label>
            <input className='password-input'
               value={password}
               onChange={(event) => setPassword(event.target.value)}
            />
         </>
      </div>
   );
}