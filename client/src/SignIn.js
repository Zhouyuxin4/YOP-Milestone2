import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/SignIn.css';
import axios from 'axios'; 

function SignIn() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const navigate = useNavigate();

    const handleToggle = () => setIsSignUp(!isSignUp);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (isSignUp) {
            console.log('Signing up:', { userName, password, profilePicture });
            const formData = new FormData();
            formData.append('userName', userName);
            formData.append('password', password);
            console.log(userName);
            console.log(password);
            console.log(formData.values());
            if (profilePicture) {
                formData.append('profilePicture', profilePicture);
            }
            try {
                const response = await axios.post('http://localhost:3000/users/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('User created:', response.data);
                alert('Sign up successfully! Please log in.');
                navigate('/'); 
            } catch (err) {
                console.error('Sign-up failed:', err.response?.data?.message || err.message);
                alert(err.response?.data?.message || 'Sign-up failed. Please try again.');
            }
        } else {
            console.log('Signing in:', { userName, password });
            try {
                const response = await axios.post('http://localhost:3000/users/login', { userName, password });
                const { token, user } = response.data;
                console.log('Login successful:', user);
                localStorage.setItem('authToken', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('user.userName', user.userName);
                console.log('Login successful:', user);
                console.log('UserName from server:', user.userName); 
                navigate('/homepageafterlogin');
            } catch (err) {
                console.error('Login failed:', err.response?.data?.message || err.message);
                alert(err.response?.data?.message || 'Invalid credentials. Please try again.');
            }
        }
    };
    
    return (
        <div className="sign-in-up-page">
            <div className='sign-in-box'>
                <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            placeholder="User ID"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        {isSignUp && (
                            <input
                                type="file"
                                onChange={(e) => setProfilePicture(e.target.files[0])}
                            />
                        )}
                    </div>
                    <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
                </form>
                <button onClick={handleToggle}>
                    {isSignUp ? 'Already have an account? Sign In' : 'New user? Sign Up'}
                </button>
            </div>
            <div className='map-background'></div>
        </div>
    );
}

export default SignIn;
