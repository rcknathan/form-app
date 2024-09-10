import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import profileImage from '../images/profile-img.png';

import '../styles/Profile.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate(); 
    const fileInputRef = useRef(null); 

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        handleFileUpload(e.target.files[0]); 
    };

    const handleFileUpload = async (file) => {
        const token = localStorage.getItem('token');
        if (!token || !file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            await axios.post('http://localhost:4000/profile/avatar', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            fetchProfile();
        } catch (error) {
            console.error('Erro ao enviar a imagem:', error);
        }
    };

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

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className="main-profile">
            <div className="header">
                <h2>Meu Perfil</h2>
            </div>

            <div className="body">
                <div className="profile-table">
                    <div className="profile-section">
                        <img 
                            src={user?.avatar ? `http://localhost:4000/uploads/${user.avatar}` : profileImage} 
                            alt="Profile" 
                            onClick={() => fileInputRef.current.click()}
                        />
                        <input 
                            type="file" 
                            accept=".jpg, .jpeg, .png" 
                            ref={fileInputRef}
                            onChange={handleFileChange} 
                            style={{ display: 'none' }}
                        />
                        <p>@{user ? user.username : 'Carregando...'}</p>
                    </div>
                    <hr className="separator"></hr>
                </div>
            </div>
        </div>
    );
}

export default Profile;
