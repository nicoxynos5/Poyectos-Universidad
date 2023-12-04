import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, within, getByRole } from '@testing-library/react';
import WS from 'vitest-websocket-mock';
import * as end from '../src/components/Endpoints'
import * as skt from '../src/components/SocketConfig'
import JoinGame from '../src/components/JoinGame'
import { act } from 'react-dom/test-utils';

const server = new WS('ws://localhost:8080');


const mockLobbyListing = [
    {name: 'test1', total_players: 4, max_players: 12, secure: true},
    {name: 'test2', total_players: 4, max_players: 12, secure: false}
]

vi.mock('../src/components/Endpoints', () => {
    const joinLobby = vi.fn((lobbyName, playerName, password) => Promise.resolve({message: 'Lobby joined'}));
    const getJoinableLobbies = vi.fn(() => {
        return Promise.resolve(mockLobbyListing);
    });
    return { joinLobby, getJoinableLobbies }
});
  
vi.mock('../src/components/SocketConfig', async () => {
    const startWebsocket = vi.fn();
    const socket = new WebSocket('ws://localhost:8080');
    return { startWebsocket, socket }
}); // TODO: mockear socket

// await server.connected; 

describe('JoinGame', () => {
    const setLobbyMock = vi.fn();
    const handleCompletionMock = vi.fn();

    it("should render", async () => {
        act(() => {
            render(<JoinGame name="test" setLobby={setLobbyMock} handleCompletion={handleCompletionMock}/>);
        })
        expect(screen.getByRole('textbox')).toBeVisible(); // Get password input    
        await waitFor(() => {
            expect(screen.getByText(/test1/i)).toBeInTheDocument(); // Get Lobbies  
            expect(screen.getByText(/test2/i)).toBeInTheDocument(); // Get Lobbies  
        })
    })

    it("should correctly log the password", async () => {
        act(() => {
            render(<JoinGame name="test" setLobby={setLobbyMock} handleCompletion={handleCompletionMock}/>);
        })
        await waitFor(() => {
            const pass  = screen.getByRole('textbox');
            fireEvent.input(pass, { target: { value: '123' } });
            expect(pass.value).toBe('123');
        })
    })

    it("should attempt to join lobby when clicked", async () => {
        act(() => {
            render(<JoinGame name="test" setLobby={setLobbyMock} handleCompletion={handleCompletionMock}/>);
        })
        await waitFor(() => {
            const secureLobby = screen.getByText(/test1/i);
            fireEvent.click(secureLobby);
            expect(end.joinLobby).toHaveBeenCalledWith('test1', 'test', 'empty');
        })
    })
})