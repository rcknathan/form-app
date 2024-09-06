import React, { useState, useEffect } from 'react';
import '../styles/PasswordStrengthChecker.css';

const PasswordStrengthChecker = ({ password, setPassword, setPasswordStrength }) => {
    const [passwordStrength, setLocalPasswordStrength] = useState(0);
    const [showStrength, setShowStrength] = useState(false);

    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length > 5) strength++;
        if (password.length > 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[\W]/.test(password)) strength++;
        return strength;
    };

    const getStrengthLabel = (strength) => {
        switch (strength) {
            case 0:
            case 1:
                return 'Fraca';
            case 2:
            case 3:
                return 'Leve';
            case 4:
            case 5:
                return 'Forte';
            case 6:
                return 'Ideal';
            default:
                return '';
        }
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        const newStrength = getPasswordStrength(newPassword);
        setLocalPasswordStrength(newStrength);
        setPasswordStrength(newStrength);
        setShowStrength(newPassword.length > 0); // Mostra o indicador apenas se houver algo no input
    };

    useEffect(() => {
        setPasswordStrength(passwordStrength);
    }, [passwordStrength, setPasswordStrength]);

    return (
        <div className="password-container">
            <div className="input-container">
                <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={() => setShowStrength(password.length > 0)} // Garante que o indicador apareça ao focar no campo se a senha tiver valor
                    required
                    placeholder=""
                />
                <label htmlFor="password">Senha</label>
            </div>
            <div className="password-p">
                {/* Sempre exibe o p, mas o texto só aparece se a senha tiver algum valor */}
                <p className={`password-strength ${getStrengthLabel(passwordStrength).toLowerCase()}`}>
                    {password.length > 0 ? getStrengthLabel(passwordStrength) : ''}
                </p>
            </div>
        </div>
    );
};

export default PasswordStrengthChecker;
