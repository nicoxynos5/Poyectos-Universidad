import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import WS from 'vitest-websocket-mock';
import Chat from '../src/components/Chat'
import { act } from 'react-dom/test-utils';
import { socket } from '../src/components/SocketConfig';
import { useState } from 'react';

const server = new WS("ws://localhost:8080");

vi.mock('../src/components/SocketConfig', () => {
  const socket = new WebSocket("ws://localhost:8080");
  return { socket }
})

const mockMessageList = [
  { sender: 'Pablo', data: 'Hola mundo!' },
  { sender: 'Mario', data: 'Hola Pablo!' },
  { sender: 'Pablo', data: 'Como estas?' },
  { sender: 'Mario', data: 'Bien y vos?' },
  { sender: 'Pablo', data: 'Bien tambien' },
  { sender: 'Ana', data: 'Dejen de joder' },
];

describe('Chat', () => {
  
  it('renders messages', async () => {
    act(() => {
      //        server.send('Hola mundo!');
      render(<Chat user_name="Mario" messageList={mockMessageList} setIncomingMessage={() => { }} />);
    })
    await waitFor(() => {
      expect(screen.getAllByText(/Pablo/)).toHaveLength(4);
      expect(screen.getAllByText(/Mario/)).toHaveLength(2);
      expect(screen.getByText(/Ana/)).toBeInTheDocument();
      expect(screen.getAllByText(/Hola/)).toHaveLength(2);
      expect(screen.getAllByText(/Bien/)).toHaveLength(2);
    })
  })

  it('logs messages', async () => {
    const data = {messageList:[]}
    const mockSetMessageList = ((data, list) => {
      data.messageList = list;
    });
    act(() => {
      render(<Chat user_name="Mario" messageList={data.messageList} setIncomingMessage={(list) => (mockSetMessageList(data, list))} />);
    })
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Hola mundo!' } });
    fireEvent.submit(input);
    await waitFor(() => {
      //expect(screen.getByText(/Mario : Hola mundo!/)).toBeInTheDocument();
    })
  });
});
