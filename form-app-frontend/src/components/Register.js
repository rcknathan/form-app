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
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const isPasswordStrongEnough = () => passwordStrength >= 4;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isPasswordStrongEnough()) {
            setPasswordError('A senha deve ser no mínimo forte');
            setSuccessMessage(''); 
            setUsernameError('');
            setEmailError(''); 
            return; 
        }

        setPasswordError('');
        setSuccessMessage('');
        setUsernameError('');
        setEmailError('');

        try {
            await axios.post('http://localhost:4000/register', { username, email, password });
            setSuccessMessage('Registro realizado com sucesso');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            console.error('Erro ao registrar:', error);
            if (error.response && error.response.data && error.response.data.error) {
                const errorMessage = error.response.data.error;
                if (errorMessage.includes('Username')) {
                    setUsernameError(errorMessage);
                } else if (errorMessage.includes('Email')) {
                    setEmailError(errorMessage);
                } else {
                    setErrorMessage('Erro ao registrar');
                }
            } else {
                setErrorMessage('Erro ao registrar');
            }
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
                        <div className="inputs-register">
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
                            <div className="error-container">
                                {passwordError && (
                                    <p className="error">{passwordError}</p>
                                )}
                                {usernameError && (
                                    <p className="error">{usernameError}</p>
                                )}
                                {emailError && (
                                    <p className="error">{emailError}</p>
                                )}
                                {errorMessage && (
                                    <p className="error">{errorMessage}</p>
                                )}
                                {successMessage && (
                                    <p className="success">{successMessage}</p>
                                )}
                            </div>
                        </div>
                        <div className="button-section">
                            <button type="submit">REGISTRAR</button>
                        </div>
                        <div className="back-container">
                            <a onClick={goToLogin} className="back-login">Voltar ao Login</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;