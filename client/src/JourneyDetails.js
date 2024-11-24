import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MapComponent from './MapComponent';
import axios from 'axios';  

function JourneyDetails() {
    const { id } = useParams();
    const [journey, setJourney] = useState({
        title: "Sample Journey",
        summary: "This is a sample summary of the journey.",
    });

    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) { 
            fetch(`/api/journey/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    setJourney(data);
                })
                .catch((error) => {
                    console.error('Error fetching journey details:', error);
                });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('address', address);
        formData.append('description', description);
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            const response = await fetch('/api/journeys/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Journey details uploaded successfully!');
                setAddress('');
                setDescription('');
                setPhoto(null);
            } else {
                alert('Failed to upload journey details.');
            }
        } catch (error) {
            console.error('Error uploading journey details:', error);
        }
    };

    const handleGoBack = () => {
        navigate('/homepageafterlogin'); 
    };

    const handleDeleteJourney = async () => {
        const isConfirmed = window.confirm('Are you sure you want to delete this journey?');

        if (!isConfirmed) {
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await axios.delete(
                `http://localhost:3000/journeys/${user.userName}/${id}`, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );

            if (response.status === 200) {
                alert('Journey deleted successfully');
                navigate('/homepageafterlogin');
            }

        } catch (error) {
            console.error('Error deleting journey:', error);
            alert('Failed to delete journey');
        }
    };

    return (
        <div className="journey-details">
            <MapComponent apiKey="AIzaSyBvjss2rrxy8HRCt-Yu6dnKRoUpX35wKh8" />
            <h1>{journey.title}</h1>
            <p>{journey.summary}</p>

            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="edit your journey title here"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <textarea
                        placeholder="Enter Description for your journey"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="file"
                        onChange={(e) => setPhoto(e.target.files[0])}
                    />
                </div>
                <button type="submit">Upload Journey Details</button>
                <button onClick={handleGoBack }>Back to My Homepage</button>
                <button onClick={handleDeleteJourney} className="delete-button"> Delete Journey </button>

            </form>
        </div>
    );
}

export default JourneyDetails;