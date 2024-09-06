import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import loginImage from '../images/login-img.png';

import '../styles/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/profile');
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao fazer login.');
        }
    };

    const goToRegister = () => {
        navigate('/register');
    };

    return (
        <div class="main-login">
            <div class="table-login">
                <div className="image-section">
                    <img src={loginImage} alt="Login" className="login-image" />
                </div>
                <div class="text-section">
                        <h2>LOGIN</h2>
                        <form onSubmit={handleSubmit}>
                            <div class="input-container">
                                <input
                                    type="email"
                                    placeholder=""
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <label for="username">Email</label>
                            </div>
                            <div class="input-container">
                                <input
                                    type="password"
                                    placeholder=""
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <label for="username">Senha</label>
                            </div>
                            <div class="button-section">
                                <button type="submit">ENTRAR</button>
                                <button onClick={goToRegister}>REGISTRAR</button>
                            </div>
                        </form>
                    </div>
            </div>
        </div>
    );
}

export default Login;