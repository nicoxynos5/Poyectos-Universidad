import { socket } from "./SocketConfig";
import { useForm } from "react-hook-form";
import "./Chat.css"

function Chat ({user_name, messageList, setIncomingMessage}) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = handleSubmit( (data) => {
        socket.send(data.message);
        const d = new Date();
        const minutes = ("0"+d.getHours()).slice(-2) + ":" + ("0"+d.getMinutes()).slice(-2);
        const time_stamp = d.getTime();
        setIncomingMessage({id:time_stamp, time:minutes, sender: user_name, data: data.message});
        reset();
    })

    return (
        <div className="chat-component">
            <div className="chat-container">
                    {
                        (messageList.sort((a,b)=>{return a.id-b.id}).reverse().map((message) => (
                            <div className="message" key={message.id}>{message.time + ' ' + String(message.sender) + ' : ' + String(message.data)}</div>
                        )))
                    }
            </div>
            <div className="form-container">
                <form className="message-input-form" 
                    onSubmit={onSubmit}>
                    <input className="form-input"
                        type="text"
                        {...register('message')}
                        placeholder="Type a message..."
                    />
                </form> 
            </div>
        </div>   
    )
}

export default Chat