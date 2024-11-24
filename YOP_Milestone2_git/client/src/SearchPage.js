import React, { useState } from 'react';
import MapComponent from './MapComponent';

function SearchPage({ addLocation }) {
    const [query, setQuery] = useState('');
    const [text, setText] = useState('');
    const [photo, setPhoto] = useState(null);
    const handleAdd = () => {
        addLocation({ query, text, photo });
        setQuery('');
        setText('');
        setPhoto(null);
    };
    return (
        <div className="search-page">
              <MapComponent apiKey="AIzaSyBvjss2rrxy8HRCt-Yu6dnKRoUpX35wKh8" />
            
            <input 
            type="text" 
            placeholder="Search location..." 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} />
            <textarea 
            placeholder="Add description..." 
            value={text} 
            onChange={(e) => setText(e.target.value)} />
            <input 
            type="file" 
            onChange={(e) => setPhoto(e.target.files[0])} />
            <button onClick={handleAdd}>Save Record</button>
        </div>
    );
}

export default SearchPage;
