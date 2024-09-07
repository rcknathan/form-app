import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import profileImage from '../images/profile-img.png';

import '../styles/Profile.css';

function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get('http://localhost:4000/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Erro ao obter perfil:', error);
                navigate('/login');
            }
        };

        fetchProfile();
    }, [navigate]);

    return (
        <div class="main-profile">
            <div class="header">
                <h2>Meu Perfil</h2>
            </div>
            <div class="body">
                <div class="profile-table">
                    <div class="profile-section">
                        <img src={profileImage} alt="Login" className="profile-image" />
                        {user ? (
                            <p>@{user.username}</p>
                        ) : (
                            <p>Carregando...</p>
                        )}
                    </div>
                    <hr class="separator"></hr>
                </div>
            </div>
        </div>
    );
}

export default Profile;