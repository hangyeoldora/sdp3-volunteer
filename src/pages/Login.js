import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
// 112
import { AuthContext } from '../helpers/AuthContext';

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setAuthState} = useContext(AuthContext);

    let navigate = useNavigate();

    const login = () => {
        const data = {username: username, password: password};
        axios.post("https://sdp3-application.herokuapp.com/auth/login", data).then((response)=>{
            if(response.data.error){
                alert(response.data.error);
            } else {
                localStorage.setItem("accessToken", response.data.token);
                // 126
                setAuthState({username: response.data.username, id: response.data.id, status: true});
                navigate('/');
            }
        })
    }
  return (
    <div className="writePage">
        <label>Username: </label>
        <input type="text" onChange={(e)=>{
            setUsername(e.target.value);
        }}/>
        <label>Password: </label>
        <input type="password" onChange={(e)=>{
            setPassword(e.target.value);
        }}/>

        <button onClick={login}>Login</button>
    </div>
  )
}

export default Login;