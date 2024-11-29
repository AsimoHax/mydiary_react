import {Navigate} from "react-router";
import View from "./view.jsx";
import axios from "../axios.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";


export default function Login() {
    const navigate = useNavigate();

    // auth.js
    if (localStorage.getItem('accessToken')) {
        window.location.href='/home';
    };


    const handleLogin = async () => {
        try{
            const res = await axios.post('http://localhost:3000/login', {email, pass}, {withCredentials:true});
            localStorage.setItem("accessToken",res.data.accessToken);
            localStorage.setItem("refreshToken",res.data.refreshToken);

            navigate('/home');

        } catch(error){
            alert("Failed to login");
        }
    }
    const [pass, setPass] = useState('');
    const [email, setEmail] = useState('');
    return (
        <>
            <div className={" w-screen h-screen bg-blue-200 overscroll-contain flex justify-center items-center"}>Login
                <div className={" border-2 border-amber-600 h-[300px] w-[400px] flex flex-col items-center justify-center p-4"}>
                    <label className={""}>Email</label>
                    <input onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email or username" className={"block h-[50px]"}/>
                    <label className={"block"}>Password</label>
                    <input onChange={(e)=>setPass(e.target.value)} type="password" placeholder="Password" className={"block mb-5"}/>
                    <button onClick={handleLogin}>Login</button>
                    <button onClick={()=>navigate('/register')}>Not register? Create a new account</button>
                </div>
            </div>
        </>
    )
}