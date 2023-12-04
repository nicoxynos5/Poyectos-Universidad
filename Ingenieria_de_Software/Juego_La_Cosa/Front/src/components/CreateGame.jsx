import React, { useState } from 'react';
import './CreateGame.css';
import { useForm } from 'react-hook-form';
import { createLobby, isLobbyExist } from './Endpoints'
import { InputField } from './FormComponents'

function CreateGame({ host, setLobby, handleCompletion }) {
   const { register, handleSubmit, watch, formState: { errors } } = useForm();
   const [serverResponse, setServerResponse] = useState('');
   const minPlayers = watch('min_players');

   const onSubmit = handleSubmit(async (data) => {
      try {
         console.log(data)
         const password = data.password === '' ? 'empty' : data.password;
         createLobby(data.lobby_name, data.min_players, data.max_players, password, host).then((response) => {
            setServerResponse(response.message)
            setLobby(data.lobby_name);
            handleCompletion();
         })
      } catch (error) {
         // Maneja los errores de la solicitud aquí
         setServerResponse(error.message);
         console.error('Server-error:', error);
      }
   });

   return (
      <div className="create-game-interface">
         <form onSubmit={onSubmit}>

            {/* Nombre de partida */}
            <InputField
               label="Nombre de Partida"
               type="text"
               register={register}
               name="lobby_name"
               rules={{
                  required: 'Este campo es obligatorio',
                  validate: async (value) => {
                     const lobbyExists = await isLobbyExist(value);
                     return !lobbyExists || 'Nombre de partida ya existente';
                  },
               }}
               errors={errors}
            />

            {/* VERIFICAR SI ES NECESARIO EL ESTADO serverResponse */}
            {serverResponse && <span className="server-response">{serverResponse}</span>}

            {/* Cantidad de jugadores minima */}
            <InputField
               label="Cantidad de Jugadores Minima"
               type="number"
               register={register}
               name="min_players"
               rules={{
                  required: 'Este campo es obligatorio',
                  min: {
                     value: 4,
                     message: 'Minimo 4',
                  },
                  max: {
                     value: 12,
                     message: 'Maximo 12',
                  },
               }}
               errors={errors}
            />

            {/* Cantidad de jugadores maxima */}
            <InputField
               label="Cantidad de Jugadores Maxima"
               type="number"
               register={register}
               name="max_players"
               rules={{
                  required: 'Este campo es obligatorio',
                  min: {
                     value: 4,
                     message: 'Minimo 4',
                  },
                  max: {
                     value: 12,
                     message: 'Maximo 12',
                  },
                  validate: (value) => {
                     return parseInt(value) >= parseInt(minPlayers) || 'El máximo no puede ser menor que el mínimo';
                  },
               }}
               errors={errors}
            />

            {/* Contraseña */}
            <div className="form-group">
               <label htmlFor="password">Contraseña</label>
               <input 
                  type="password" 
                  aria-label="password"
                  {...register('password')} 
                  placeholder="Opcional"
               />
            </div>

            {/* Boton de crear partida */}
            <button type="submit">Crear Partida</button>

         </form>
      </div>
   );
}

export default CreateGame;
