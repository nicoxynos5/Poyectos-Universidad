import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import * as end from '../src/components/Endpoints'
import UserLogin from '../src/components/UserLogin';

vi.mock('../src/components/Endpoints', () => {
  const createUser = vi.fn((userName) => {
    return Promise.resolve({message: `Usuario ${userName} creado`})
  });
  const isUserExist = vi.fn();
  return { createUser, isUserExist }
})


describe('UserLogin', () => {
  
  const setNameMock = vi.fn();
  const handleCompletionMock = vi.fn();

  it('should render the components', () => {
    render(<UserLogin setName={setNameMock} handleCompletion={handleCompletionMock} />);
    expect(screen.getByText(/Nombre de usuario/i)).toBeVisible();
    expect(screen.getByRole('textbox')).toBeVisible();
    expect(screen.getByText(/Iniciar/i)).toBeVisible();
    expect(screen.getByRole('button')).toBeVisible();
  });

  it('should show an error message when the name field is empty', async () => {
    render(<UserLogin setName={setNameMock} handleCompletion={handleCompletionMock} />);
    const submitButton = screen.getByRole('textbox');
    fireEvent.submit(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/Este campo es requerido/i)).toBeInTheDocument();
    });
  });

  it('should process correct name', async () => {
    render(<UserLogin setName={setNameMock} handleCompletion={handleCompletionMock} />);
    // Get relevant elements
    const nameInput = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button');
    // Load name and confirm
    fireEvent.input(nameInput, { target: { value: 'test' } });
    expect(nameInput.value).toBe('test');
    // Submit name and confirm processing
    fireEvent.click(submitButton);
    await waitFor(() => {
      const serverResponse = screen.getByText(/Usuario test Creado/i);
      expect(serverResponse).toBeInTheDocument();
      expect(end.createUser).toHaveBeenCalled();
      expect(setNameMock).toHaveBeenCalled();
      expect(handleCompletionMock).toHaveBeenCalled();
    });
  })
});