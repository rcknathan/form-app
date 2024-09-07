import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PasswordStrengthChecker from './PasswordStrengthChecker';

import '../styles/General.css';
import '../styles/Register.css';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const isPasswordStrongEnough = () => passwordStrength >= 4;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isPasswordStrongEnough()) {
            setPasswordError('A senha deve ser no mínimo forte');
            return;
        }

        try {
            await axios.post('http://localhost:4000/register', { username, email, password });
            alert('Registro bem-sucedido!');
            navigate('/login');
        } catch (error) {
            console.error('Erro ao registrar:', error);
            alert('Erro ao registrar.');
        }
    };

    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="main">
            <div className="table-register">
                <div className="text-section">
                    <h2>REGISTRO</h2>
                        <form onSubmit={handleSubmit}>
                            <div class="inputs-register">
                                <div className="input-container">
                                    <input
                                        type="text"
                                        value={username}
                                        placeholder=""
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="username">Username</label>
                                </div>
                                <div className="input-container">
                                    <input
                                        type="email"
                                        value={email}
                                        placeholder=""
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="email">Email</label>
                                </div>
                                <PasswordStrengthChecker 
                                    password={password} 
                                    setPassword={setPassword} 
                                    setPasswordStrength={setPasswordStrength} 
                                />
                                <div class="error-container">
                                    {passwordError && (
                                        <p className="password-error">{passwordError}</p>
                                    )}
                                </div>
                            </div>
                        <div className="button-section">
                            <button type="submit">REGISTRAR</button>
                        </div>
                        <div class="back-container">
                            <a onClick={goToLogin} class="back-login">Voltar ao Login</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
