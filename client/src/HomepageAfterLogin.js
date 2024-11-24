import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/HomepageAfterLogin.css';
import axios from 'axios'; 

function HomepageAfterLogin({ userProfile }) {
    const [userName, setUserName] = useState('');
    const [journeys, setJourneys] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect (()=>{
        const loginUser = localStorage.getItem('user');
        if (loginUser) {
            const user = JSON.parse(loginUser);
            setUserName(user.userName);
            setProfilePicture(user.profilePicture);
        }
    },[]);

    const navigate = useNavigate();

    const handleCreateJourney = async (e) => {
        e.preventDefault();
        const userName = localStorage.getItem('user.userName');
        if (!userName) {
            console.error("No userName found in localStorage");
            return; 
        }
        const defaultTitle = "My New Journey";
        const defaultDetails = null;
        const journey = { title: defaultTitle, details: defaultDetails };
        console.log('Create a new journey', journey);
        try {
            const response = await axios.post(`http://localhost:3000/journeys/${userName}`, journey, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            const journeyId = response.data._id;
            console.log('Journey created:', response.data);
            navigate(`/journey/${journeyId}`);
        } catch (err) {
            console.error("Failed to create journey:", err);
        }
    };

    useEffect(() => {
        const userName = localStorage.getItem('user.userName');
        if (!userName) {
            console.error("No userName found in localStorage");
            return;
        }
        console.log(userName);
        axios.get(`http://localhost:3000/journeys/${userName}`)
            .then(response => {
                console.log(response.data);
                setJourneys(response.data);
            })
            .catch(error => {
                console.error('Error fetching journeys:', error);
            });
    }, []);
    

    const handleJourneyClick = (id) => {
        navigate(`/journey/${id}`); 
    };

    const handleLogout = (e)=>{
        localStorage.removeItem('user');
        navigate('/')
    };

    return (
        <div className='home-page-after-login'>
            <box name>
            <h1>Welcome to Your Own Planet, {userName}!</h1> 
            <div className='profile-info'>
              <img 
                    src={profilePicture || './image/default-profile.jpg'} 
                    alt="Profile" 
                    className="profile-picture" 
                />
                <button onClick={() => navigate('/profile')}>Profile</button>
            </div>
            <div className="historical-footprints">
                <h2>My Historical Footprints</h2>
                <div className="journeys-list">
                    {journeys && journeys.length > 0 ? (
                        journeys.map((journey) => (
                            journey && journey.title ? (
                                <div key={journey._id} className="journey-card" onClick={() => handleJourneyClick(journey._id)}>
                                    <h3>{journey.title}</h3>
                                </div>
                            ) : null
                        ))
                    ) : (
                        <div className="no-journeys">
            <p>No previous journeys found.</p>
        </div>
    )}
</div>

                <button onClick={handleCreateJourney}>Create a New Journey</button>
                <button onClick={() => navigate('/search')}>Search Your Journey</button>
                <button onClick={handleLogout}>Sign Out</button>
            </div>
            </box>
        </div>
    );
}

export default HomepageAfterLogin;
