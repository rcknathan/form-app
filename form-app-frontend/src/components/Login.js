import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import loginImage from '../images/login-img.png';

import '../styles/General.css';
import '../styles/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setEmailError('');
        setPasswordError('');
        setGeneralError('');

        try {
            const response = await axios.post('http://localhost:4000/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/profile');
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            if (error.response && error.response.data && error.response.data.error) {
                const errorMessage = error.response.data.error;
                if (errorMessage.includes('Usuário não encontrado')) {
                    setEmailError(errorMessage);
                } else if (errorMessage.includes('Senha incorreta')) {
                    setPasswordError(errorMessage);
                } else {
                    setGeneralError('Erro ao fazer login');
                }
            } else {
                setGeneralError('Erro ao fazer login');
            }
        }
    };

    const goToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="main">
            <div className="table-login">
                <div className="image-section">
                    <img src={loginImage} alt="Login" className="login-image" />
                </div>
                <div className="text-section">
                    <h2>LOGIN</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-container">
                            <input
                                type="email"
                                placeholder=""
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className="input-container">
                            <input
                                type="password"
                                placeholder=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="password">Senha</label>
                        </div>
                        <div className="error-container">
                            {emailError && <p className="error">{emailError}</p>}
                            {passwordError && <p className="error">{passwordError}</p>}
                            {generalError && <p className="error">{generalError}</p>}
                        </div>
                        <div className="button-section">
                            <button type="submit">ENTRAR</button>
                            <button type="button" onClick={goToRegister}>NÃO TENHO CONTA</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
