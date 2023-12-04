// Componente para manejar los mensajes de error
function ErrorMessage({ message }) {
    return message ? <span className="error-message">{message}</span> : null;
}

// Componente para el campo de entrada
export function InputField({ label, type, register, maxLength, placeholder, name, rules, errors }) {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input
                type={type}
                aria-label={name}
                {...register(name, rules)}
                maxLength={maxLength}
                placeholder={placeholder}
            />
            <ErrorMessage message={errors[name]?.message} />
        </div>
    );
}