import React, { useEffect, useState } from 'react';
import './tokenData.css';

const TokenComponent = () => {
    const [tokenData, setTokenData] = useState(null); // State to hold token data
    const [error, setError] = useState(null); // State to hold any errors

    const getInfo = async () => {
        try {
            const response = await fetch('http://localhost:8000/getTokenInfo', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setTokenData(data); // Update the state with the fetched data
            console.log(data);
        } catch (error) {
            setError(error); // Update the error state
            console.log(error);
        }
    };

    useEffect(() => {
        getInfo(); // Fetch token data when component mounts
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>; // Render error if exists
    }

    if (!tokenData) {
        return <div>Loading...</div>; // Render loading state while fetching
    }

    return (
        <div class="token-container">
            <h1 class="token-name">{tokenData.tokenName}</h1>
            <p class="token-description">{tokenData.tokenDescription}</p>
            <img src={tokenData.tokenImage} alt={tokenData.tokenImage} />
        </div>
    );
};

export default TokenComponent;