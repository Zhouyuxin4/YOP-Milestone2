import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import axios from 'axios';

const libraries = ['places'];

const MapComponent = ({ apiKey }) => {
    const [markers, setMarkers] = useState([]);
    const [autocomplete, setAutocomplete] = useState(null);
    const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
    const [detailID, setDetailId] = useState(null);
    const [journeyName, setJourneyName] = useState('');
    const [journeyDescription, setJourneyDescription] = useState('');
    const [user, setUser] = useState(null);
    const [journeyId, setJourneyId] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchDetails = async () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const userData = JSON.parse(userStr);
                setUser(userData);
                
                console.log('User data loaded:', userData);
            }

            const pathArray = window.location.pathname.split('/');
            const id = pathArray[pathArray.length - 1];
            setJourneyId(id);

            try {

                const response = await axios.get(
                    `http://localhost:3000/details/${id}/allDetails`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`
                        }
                    }
                );

                // Convert to all details to markers
                const existingMarkers = response.data.map(detail => ({
                    lat: detail.location.coordinates[1],
                    lng: detail.location.coordinates[0],
                    title: detail.journalText,
                    image: detail.journalPhoto,
                }));

                setMarkers(existingMarkers);
                console.log('Loaded existing markers:', existingMarkers);
            } catch (error) {
                console.error('Error fetching existing details:', error);
            }
        };

        fetchDetails();
    }, []); 

    const mapContainerStyle = {
        width: '100%',
        height: '500px',
    };
    const center = {
        lat: 49.1539,
        lng: -123.0650,
    };

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const tokenPayload = JSON.parse(atob(authToken.split('.')[1]));
    const userId = tokenPayload.userId; 

    const handleMapClick = (event) => {
        const newMarker = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
            title: '',  
            image: '',
        };
        setMarkers(prev => [...prev, newMarker]);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            const location = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };
            handleMapClick(location);
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
            console.log('Saving marker:', marker);
            console.log('User:', user);
            console.log('JourneyId:', journeyId);

            if (!user?.userName || !journeyId) {
                throw new Error('Missing user or journey information');
            }

            if (!marker.title?.trim()) {
                alert('Please enter journal text before saving');
                return;
            }
    
            // if (!marker.image) {
            //     alert('Please upload a photo before saving');
            //     return;
            // }
    
            //convert to backend journeyDetails Schema
            const detailData = {
                time: new Date().toISOString(),
                location: {
                    type: "Point",
                    coordinates: [
                        marker.lng,  
                        marker.lat   
                    ]
                },
                journalText: marker.title,   
                journalPhoto: marker.image, 
                journeyId: journeyId
            };

            console.log(detailData);

            const response = await axios.post(`http://localhost:3000/details/${userId}/${journeyId}/createDetails`,
            detailData,
             {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            const newDetailId = response.data._id;
            setDetailId(newDetailId);
            localStorage.setItem('currentDetailId', newDetailId);

            if (response.status === 200) {
                alert('Detail saved successfully');
                setSelectedMarkerIndex(null);

                const updatedMarkers = [...markers];
                updatedMarkers[index] = {
                    ...marker,
                    detailId: newDetailId,
                    saved: true
                };
                setMarkers(updatedMarkers);

                alert('Detail saved successfully');
                setSelectedMarkerIndex(null);
            }

        } catch (error) {
            console.error('Error saving marker:', error);
        }
    };

    const handleClose = () => {
        setSelectedMarkerIndex(null);
    };

    const handleDelete = async (index) => {
        const marker = markers[index];

        if (!marker.detailId) {
            // 如果是未保存的 marker，直接从数组中移除
            const updatedMarkers = markers.filter((_, i) => i !== index);
            setMarkers(updatedMarkers);
            setSelectedMarkerIndex(null);
            return;
        }

        console.log('Deleting marker:', marker); 
        try {
            await axios.delete(`http://localhost:3000/details/${journeyId}/${detailID}`);
            const updatedMarkers = markers.filter((_, i) => i !== index);
            setMarkers(updatedMarkers);
            setSelectedMarkerIndex(null);

            console.log('Marker deleted successfully');
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
                        // icon={marker.saved ? {
                        //     url: 'path_to_saved_marker_icon',  // 可选：使用不同的图标
                        //     scaledSize: new window.google.maps.Size(30, 30)
                        // } : undefined}
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
                            value={markers[selectedMarkerIndex].title}
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