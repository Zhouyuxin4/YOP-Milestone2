import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import axios from 'axios';

const libraries = ['places'];

const MapComponent = ({ apiKey }) => {
    const [markers, setMarkers] = useState([]);
    const [autocomplete, setAutocomplete] = useState(null);
    const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
    const [journeyName, setJourneyName] = useState('');
    const [journeyDescription, setJourneyDescription] = useState('');
    const mapContainerStyle = {
        width: '100%',
        height: '500px',
    };
    const center = {
        lat: 49.1539,
        lng: -123.0650,
    };

    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/journeys');
                setMarkers(response.data);
            } catch (error) {
                console.error('Error fetching markers:', error);
            }
        };
        fetchMarkers();
    }, []); 

    const addMarker = (location) => {
        const newMarker = {
            lat: location.lat,
            lng: location.lng,
            title: '',
            image: '',
        };
        setMarkers((current) => [...current, newMarker]);
    };

    const handleMapClick = (event) => {
        const newMarker = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        addMarker(newMarker);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            const location = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };
            addMarker(location);
        }
    };

    const handleTitleChange = (index, value) => {
        const updatedMarkers = [...markers];
        updatedMarkers[index].title = value;
        setMarkers(updatedMarkers);
    };

    const handleImageUpload = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedMarkers = [...markers];
                updatedMarkers[index].image = reader.result;
                setMarkers(updatedMarkers);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (index) => {
        const marker = markers[index];
        try {
            await axios.post('http://localhost:3000/journeys', marker);
            setSelectedMarkerIndex(null);
        } catch (error) {
            console.error('Error saving marker:', error);
        }
    };

    const handleClose = () => {
        setSelectedMarkerIndex(null);
    };

    const handleDelete = async (index) => {
        const markerId = markers[index]._id; 
        try {
            await axios.delete(`http://localhost:3000/journeys/${markerId}`);
            const updatedMarkers = markers.filter((_, i) => i !== index);
            setMarkers(updatedMarkers);
            setSelectedMarkerIndex(null);
        } catch (error) {
            console.error('Error deleting marker:', error);
        }
    };

    return (
        <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={10}
                onClick={handleMapClick}
            >
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        onClick={() => setSelectedMarkerIndex(index)}
                    />
                ))}

                {selectedMarkerIndex !== null && (
                     <div
                     style={{
                         position: 'absolute',
                         top: `${(markers[selectedMarkerIndex].lat - center.lat) * 500 / 10 + 50}%`,
                         left: `${(markers[selectedMarkerIndex].lng - center.lng) * 500 / 10 + 50}%`,
                         transform: 'translate(-50%, -50%)',
                         backgroundColor: 'white',
                         padding: '10px',
                         borderRadius: '5px',
                         boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                     }}
                 >
                    <div>
                        <textarea
                            type="text"
                            placeholder="Enter your memories here..."
                            value={markers[selectedMarkerIndex].memories}
                            onChange={(e) => handleTitleChange(selectedMarkerIndex, e.target.value)}
                            style={{ width: '200px',
                                marginBottom: '10px',
                                height: '100px',
                                resize: 'vertical', 
                                overflow: 'auto', } }
                        />
                    </div>
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(selectedMarkerIndex, e)}
                            style={{ width: '200px', marginBottom: '10px' }}
                        />
                        {markers[selectedMarkerIndex].image && (
                            <img
                                src={markers[selectedMarkerIndex].image}
                                alt="Uploaded Preview"
                                style={{ width: '100px', height: '100px', marginTop: '10px' }}
                            />
                        )}
                    </div>
                    <button
                        onClick={() => handleSave(selectedMarkerIndex)}
                        style={{
                            padding: '5px 10px',
                            backgroundColor: 'green',
                            color: 'white',
                            borderRadius: '5px',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Save
                    </button>
                    <button
                        onClick={handleClose}
                        style={{
                            padding: '5px 10px',
                            backgroundColor: 'red',
                            color: 'white',
                            borderRadius: '5px',
                            border: 'none',
                            cursor: 'pointer',
                            marginLeft: '10px',
                        }}
                    >
                        Close
                    </button>
                    <button
                        onClick={() => handleDelete(selectedMarkerIndex)}
                        style={{
                            padding: '5px 10px',
                            backgroundColor: 'orange',
                            color: 'white',
                            borderRadius: '5px',
                            border: 'none',
                            cursor: 'pointer',
                            marginLeft: '10px',
                        }}
                    >
                        Delete
                    </button>
                </div>
                )}

                <Autocomplete onLoad={(autocomplete) => setAutocomplete(autocomplete)} onPlaceChanged={onPlaceChanged}>
                    <input
                        type="text"
                        placeholder="Search location"
                        style={{
                            boxSizing: 'border-box',
                            border: '1px solid transparent',
                            width: '240px',
                            height: '32px',
                            padding: '0 12px',
                            borderRadius: '3px',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                            fontSize: '14px',
                            position: 'absolute',
                            left: '50%',
                            marginLeft: '-120px',
                        }}
                    />
                </Autocomplete>
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;