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
    const [details, setDetails] = useState([]); 

    const [markers, setMarkers] = useState([]);
    const navigate = useNavigate();

    const fetchJourneyDetails = async () => {
        try {

            const response = await axios.get(
                `http://localhost:3000/details/${id}/allDetails`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                } 
            );

            setDetails(response.data);
            console.log('Fetched details:', response.data);

        } catch (error) {
            console.error('Error fetching journey details:', error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchJourneyDetails();
        }
    }, [id]);

    const handleDetailsUpdate = () => {
        fetchJourneyDetails();
    };

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

    //Update the Journey Title
    const handleUpdateJourney = async () => {
        try {

            //Title cannot be empty
            if (!address.trim()) {
                alert('Title cannot be empty');
                return; 
            }

            const response = await axios.put(
                `http://localhost:3000/journeys/${id}`,
                {
                    title: address,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );

            if (response.status === 200) {
                alert('Journey updated successfully');
                navigate('/homepageafterlogin');
            }

        } catch (error) {
            console.error('Error updating journey:', error);
            alert('Failed to updating journey');
        }
    };

    //Delete The Journey
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

            <div className="details-list">
                <h2>Journey Details</h2>
                {details.length > 0 ? (
                    details.map((detail, index) => (
                        <div key={detail._id} className="detail-item">
                            <h3>Stop {index + 1}</h3>
                            <p><strong>Location:</strong> {
                                detail.location?.coordinates ? 
                                `Latitude: ${detail.location.coordinates[1].toFixed(4)}, Longitude: ${detail.location.coordinates[0].toFixed(4)}` :
                                'Location not available'
                            }</p>

                            <p><strong>Time:</strong> {
                                new Date(detail.time).toLocaleString()
                            }</p>

                            <p><strong>Journal:</strong> {detail.journalText || 'No journal entry'}</p>

                            {detail.journalPhoto && detail.journalPhoto !== "" && (
                            <div className="photo-container">
                                <img 
                                    src={detail.journalPhoto} 
                                    alt={`Photo for stop ${index + 1}`}
                                    style={{ maxWidth: '200px' }}
                                />
                            </div>
                        )}
                        </div>
                    ))
                ) : (
                    <p>No details added to this journey yet.</p>
                )}
            </div>

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

                <button type="submit">Upload Journey Details</button>
                <button onClick={handleGoBack }>Back to My Homepage</button>
                <button onClick={handleDeleteJourney} className="delete-button"> Delete Journey </button>
                <button onClick={handleUpdateJourney}>Update Journey</button>

            </form>
        </div>
    );
}

export default JourneyDetails;