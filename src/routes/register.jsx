
import axios from 'axios';
import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const handleRegister = async () => {
        try{
            await axios.post('http://localhost:3000/register', {email, username, password}, {withCredentials:true});
            alert("Successfully registered!");
            window.location.href='/login';
        } catch(error){
            alert(`Failed to register ${error}`);
        }
    }
    const [password, setPass] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    return (
        <>
            <div className={" w-screen h-screen bg-blue-200 overscroll-contain flex justify-center items-center"}>
                <div
                    className={" border-2 border-amber-600 h-[300px] w-[400px] flex flex-col items-center justify-center p-4"}>
                    <label className={""}>Username</label>
                    <input onChange={(e) => setUsername(e.target.value)} type="email" placeholder="Username" className={"block h-[50px]"}/>
                    <label className={"block"}>Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Example@gmail.com"
                           className={"block mb-5"}/> <label className={"block"}>Password</label>
                    <input onChange={(e) => setPass(e.target.value)} type="password" placeholder="Password"
                           className={"block mb-5"}/>
                    <button onClick={handleRegister}>Register</button>
                    <button onClick={() => navigate('/login')}>Already have an account? Log in</button>
                </div>
            </div>
        </>
    )
}