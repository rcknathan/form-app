import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import profileImage from '../images/profile-img.png';
import '../styles/Profile.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const menuRef = useRef(null);

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

            // Forçar atualização da página com nova foto
            fetchProfile();
        } catch (error) {
            console.error('Erro ao enviar a imagem:', error);
        }
    };

    const handleRemoveProfilePicture = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await axios.post('http://localhost:4000/profile/remove-avatar', null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            fetchProfile();
        } catch (error) {
            console.error('Erro ao remover a imagem:', error);
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="main-profile">
            <div className="header">
                <h2>Meu Perfil</h2>
            </div>

            <div className="body">
                <div className="profile-table">
                    <div className="profile-section">
                        <div className="profile-img-container">
                            <img 
                                src={user?.avatar ? `http://localhost:4000/uploads/${user.avatar}?${new Date().getTime()}` : profileImage} 
                                alt="Profile" 
                                onClick={() => setMenuVisible(!menuVisible)}
                                style={{ cursor: 'pointer' }}
                            />
                            <div 
                                className={`profile-menu ${menuVisible ? 'show' : ''}`} 
                                ref={menuRef}
                            >
                                <button onClick={() => fileInputRef.current.click()}>Escolher foto de perfil</button>
                                <button onClick={handleRemoveProfilePicture}>Remover foto de perfil</button>
                            </div>
                        </div>
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
