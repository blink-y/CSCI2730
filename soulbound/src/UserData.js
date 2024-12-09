import React, { useState } from 'react'
import './userdata.css'

const UserData = (props) => {
    const [user, setUser] = useState(null);

    const getUserData = async () => {
        try {
            const response = await fetch('http://localhost:8000/getUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    walletAddress: props.address
                })
            });
            const data = await response.json();
            console.log(data);
            setUser(data);
        }
        catch (error) {
            console.log(error);
        }
    };

    return (
        <><div className='container'>
            <button onClick={getUserData}>Get User Data</button>
        </div><div>
                {user ?
                    <>
                        <form className="user-info-form">
                            <h2>User Information</h2>
                            <div className="form-group">
                                <label htmlFor="name">Name:</label>
                                <input type="text" id="name" value={user.name} readOnly />
                            </div>
                            <div className="form-group">
                                <label htmlFor="hkid">HKID:</label>
                                <input type="text" id="hkid" value={user.hkid} readOnly />
                            </div>
                            <div className="form-group">
                                <label htmlFor="dateOfBirth">Date of Birth:</label>
                                <input type="text" id="dateOfBirth" value={user.dateOfBirth} readOnly />
                            </div>
                            <div className="form-group">
                                <label htmlFor="nationality">Nationality:</label>
                                <input type="text" id="nationality" value={user.nationality} readOnly />
                            </div>
                            <div className="form-group">
                                <label htmlFor="gender">Gender:</label>
                                <input type="text" id="gender" value={user.gender} readOnly />
                            </div>
                        </form>
                    </> : null}
            </div></>

    );
}

export default UserData;