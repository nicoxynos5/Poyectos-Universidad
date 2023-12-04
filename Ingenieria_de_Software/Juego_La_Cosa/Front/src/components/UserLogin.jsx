import './UserLogin.css'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { createUser, isUserExist } from './Endpoints'
import { InputField } from './FormComponents'

export default function UserLogin({ setName, handleCompletion }) {
  const [serverResponse, setServerResponse] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Function to handle the form submission
  const onSubmit = async (input_data) => {
    try {
      createUser(input_data.name)
      .then(response => {
        setServerResponse(response.message);
        setName(input_data.name);
        handleCompletion();
      });
    }
    catch (error) {
      // Maneja los errores de la solicitud aquí
      setServerResponse(error.message);
      console.error('Server-error:', error);
    }
  }

  return (
    <div className='user-login-interface'>
      <form
        className='user-login-form'
        onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Nombre de usuario"
          type="text"
          register={register}
          name="name"
          maxLength={20}
          rules={{
            required: 'Este campo es requerido',
            validate: async (value) => {
              const response = await isUserExist(value);
              return !response || 'Nombre de usuario ya existente';
            }
          }}
          errors={errors}
        />
        {serverResponse && <span className="server-response">{serverResponse}</span>} 
        <button type='submit'>Iniciar</button>
      </form>
    </div>
  );
}