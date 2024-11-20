import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
function ProfilePage() {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const navigate = useNavigate();


    const handleSave = (e) => {
        e.preventDefault();
            console.log('Edit Profile', { userName, password, profilePicture });
            const user = {userName, password, profilePicture}
            console.log(user)
            axios.put(`http://localhost:3000/users/${userName}`, user).then(() => console.log('users profile updated.')).catch(err => {
        console.error(err);
      });
    };

    const handleDelete = (e) => {
        e.preventDefault();
            console.log('delete account', { userName});
            const user = {userName}
            console.log(user)
            axios.delete(`http://localhost:3000/users/${userName}`, user).then(() => console.log('users account deleted.')).catch(err => {
        console.error(err);
        localStorage.removeItem('user');
        navigate('/');
    });
};

    const handleGoBack = () => {
        navigate('/homepageafterlogin'); 
    };

    return (
        <div className="profile-page">
            <h1>Edit Profile</h1>
            <form onSubmit={handleSave}>
                <div>
                    <input
                        type="text"
                        name="userName"
                        placeholder="User Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="file"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                    />
                </div>
                <div>
                    <button onClick={handleSave}>Save Changes</button>
                </div>
                <div>
                    <button onClick={handleDelete}>Delete My Account</button>
                </div>
            </form>
            <button onClick={handleGoBack}>Back to Homepage</button>
        </div>
    );
}

export default ProfilePage;
