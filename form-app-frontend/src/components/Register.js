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
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const isPasswordStrongEnough = () => passwordStrength >= 4;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if password is strong enough
        if (!isPasswordStrongEnough()) {
            setPasswordError('A senha deve ser no mínimo forte');
            setSuccessMessage(''); // Clear success message if password is weak
            setErrorMessage(''); // Clear error message if password is weak
            return; // Exit the function if password is not strong enough
        }

        // Clear error messages if password is strong
        setPasswordError('');
        setSuccessMessage('');
        setErrorMessage('');

        try {
            await axios.post('http://localhost:4000/register', { username, email, password });
            setSuccessMessage('Registro realizado com sucesso');
            setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
        } catch (error) {
            console.error('Erro ao registrar:', error);
            setErrorMessage('Erro ao registrar');
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
