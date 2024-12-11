import React, { useState } from 'react';
import './form.css';
import TokenComponent from './tokenData';
const UserForm = (props) => {
    const [formData, setFormData] = useState({
        name: '',
        hkid: '',
        dateOfBirth: '',
        nationality: '',
        gender: ''
    });

    const [mint, setMint] = useState(false);
    const [loading, setLoading] = useState(false);
    const [afterMint, setAfterMint] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data:', formData);
    };

    const submitFormData = async () => {
        try {
            const response = await fetch('http://localhost:8000/formdata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    walletAddress: props.address,
                    name: formData.name,
                    hkid: formData.hkid,
                    gender: formData.gender.toString(),
                    dateOfBirth: formData.dateOfBirth,
                    nationality: formData.nationality
                })
            });
            const data = await response.text();
            console.log(data);
            setMint(true);
        }
        catch (error) {
            console.log(error);
        }
    };

    const mintToken = async () => {
        setLoading(true); // Set loading to true before the fetch request
        try {
            const response = await fetch('http://localhost:8000/mintSBT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    walletAddress: props.address
                })
            });
            const data = await response.text();
            console.log(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setAfterMint(true);  // Set loading to false after the fetch request
        }
    };


    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="hkid">HKID:</label>
                    <input
                        type="text"
                        id="hkid"
                        name="hkid"
                        value={formData.hkid}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth:</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="nationality">Nationality:</label>
                    <select
                        id="nationality"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select nationality</option>
                        <option value="Hong Kong">Hong Kong</option>
                        <option value="china">China</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Gender:</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={formData.gender === 'Male'}
                                onChange={handleInputChange}
                            />
                            Male
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={formData.gender === 'Female'}
                                onChange={handleInputChange}
                            />
                            Female
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Other"
                                checked={formData.gender === 'Other'}
                                onChange={handleInputChange}
                            />
                            Other
                        </label>
                    </div>
                </div>
                <button className="submitbutton" type="submit" onClick={submitFormData}>Submit</button>
            </form>
            {mint ? (
                <>
                    <button className="mintbutton" onClick={mintToken}>Mint Soul Bound Token</button>
                    {loading ? (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
                            zIndex: 1000, // Higher z-index to overlay the button
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <div className="loading">Wait while your token is being minted...</div>
                        </div>
                    ) : (
                        null
                    )}
                </>
            ) : null}
            {afterMint && !loading ? <TokenComponent /> : null}

        </div>
    );
};

export default UserForm;