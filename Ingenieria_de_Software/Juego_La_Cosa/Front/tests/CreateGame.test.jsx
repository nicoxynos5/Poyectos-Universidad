import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import * as end from '../src/components/Endpoints'
import CreateGame from '../src/components/CreateGame'

vi.mock('../src/components/Endpoints', () => {
  const createLobby = vi.fn((lobbyName, minPlayers, maxPlayers, password, hostName) => {
    return Promise.resolve({message: `Lobby ${lobbyName} creado con ${hostName} como host ${minPlayers}-${maxPlayers} jugadores y contraseña ${password}`})
  });
  const isLobbyExist = vi.fn(() => {
    return Promise.resolve(false)
  });
  return { createLobby, isLobbyExist }
})

describe('CreateGame', () => {
  const setLobbyMock = vi.fn(()=>{});
  const handleCompletionMock = vi.fn();
  
  it('should render the component', () => {
    render(<CreateGame host="Mario" setLobby={setLobbyMock} handleCompletion={handleCompletionMock}/>);
    expect(screen.getByText(/Nombre de Partida/i)).toBeInTheDocument();
    expect(screen.getByText(/Cantidad de Jugadores Minima/i)).toBeInTheDocument();
    expect(screen.getByText(/Cantidad de Jugadores Maxima/i)).toBeInTheDocument();
    expect(screen.getByText(/Contraseña/i)).toBeInTheDocument();
  });

  it('should show an error when the input is empty', async () => {
    render(<CreateGame host="Mario" setLobby={setLobbyMock} handleCompletion={handleCompletionMock}/>);
    // Intentar enviar el formulario sin ingresar datos
    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);    
    await waitFor(() => {
      expect(screen.getAllByText('Este campo es obligatorio')).toHaveLength(3);
    })
  });

  it('should only show an error for the empty fields', async () => {
    render(<CreateGame host="Mario" setLobby={setLobbyMock} handleCompletion={handleCompletionMock}/>);
    // Elementos relevantes
    const nameInput = screen.getByLabelText("lobby_name");
    const minInput = screen.getByLabelText("min_players");
    const maxInput = screen.getByLabelText("max_players");
    const pass = screen.getByLabelText("password");
    const submitButton = screen.getByRole('button');
    // Intentar enviar el formulario sin ingresar datos
    fireEvent.click(submitButton);    
    await waitFor(() => {
      expect(screen.getAllByText('Este campo es obligatorio')).toHaveLength(3);
    })
    // Ingresar el nombre
    fireEvent.input(nameInput, { target: { value: 'Juego 123' } });
    fireEvent.click(submitButton);    
    await waitFor(() => {
      expect(screen.getAllByText('Este campo es obligatorio')).toHaveLength(2);
    })
    // Ingresar el nombre y el minimo
    fireEvent.input(minInput, { target: { value: '8' } });
    fireEvent.click(submitButton);    
    await waitFor(() => {
      expect(screen.getAllByText('Este campo es obligatorio')).toHaveLength(1);
    })
  });

  it('should show an error when the input is invalid', async () => {
    render(<CreateGame host="Mario" setLobby={setLobbyMock} handleCompletion={handleCompletionMock}/>);

    const nameInput = screen.getByLabelText("lobby_name");
    const minInput = screen.getByLabelText("min_players");
    const maxInput = screen.getByLabelText("max_players");
    const pass = screen.getByLabelText("password");
    const submitButton = screen.getByRole('button');

    fireEvent.input(nameInput, { target: { value: 'Juego 123' } });
    fireEvent.input(minInput, { target: { value: '2' } });
    fireEvent.input(maxInput, { target: { value: '15' } });
    fireEvent.input(pass, { target: { value: '123' } });

    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(end.isLobbyExist).toHaveBeenCalled();
      expect(screen.getByText('Minimo 4')).toBeInTheDocument();
      expect(screen.getByText('Maximo 12')).toBeInTheDocument();
    });
  });

  it('should show an error when the minimum is greater than the maximum', async () => {
    render(<CreateGame host="Mario" setLobby={setLobbyMock} handleCompletion={handleCompletionMock}/>);

    const nameInput = screen.getByLabelText("lobby_name");
    const minInput = screen.getByLabelText("min_players");
    const maxInput = screen.getByLabelText("max_players");
    const pass = screen.getByLabelText("password");
    const submitButton = screen.getByRole('button');

    fireEvent.input(nameInput, { target: { value: 'Juego 123' } });
    fireEvent.input(minInput, { target: { value: '9' } });
    fireEvent.input(maxInput, { target: { value: '8' } });
    fireEvent.input(pass, { target: { value: '123' } });

    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(end.isLobbyExist).toHaveBeenCalled();
      expect(screen.getByText('El máximo no puede ser menor que el mínimo')).toBeInTheDocument();
    });
  });

  it('should send the form when the inputs are valid', async () => {
    render(<CreateGame host="Mario" setLobby={setLobbyMock} handleCompletion={handleCompletionMock}/>);

    const nameInput = screen.getByLabelText("lobby_name");
    const minInput = screen.getByLabelText("min_players");
    const maxInput = screen.getByLabelText("max_players");
    const pass = screen.getByLabelText("password");
    const submitButton = screen.getByRole('button');

    fireEvent.input(nameInput, { target: { value: 'Juego 123' } });
    fireEvent.input(minInput, { target: { value: '4' } });
    fireEvent.input(maxInput, { target: { value: '4' } });
    //fireEvent.input(pass, { target: { value: '123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(end.createLobby).toHaveBeenCalled(); //! No se porque no funciona
      expect(end.isLobbyExist).toHaveBeenCalled();
      expect(setLobbyMock).toHaveBeenCalled();
      expect(handleCompletionMock).toHaveBeenCalled();

      const serverResponse = screen.getByText(/Lobby Juego 123 creado con Mario como host 4-4 jugadores y contraseña empty/i);
      expect(serverResponse).toBeInTheDocument();
    });
    
  });

});
