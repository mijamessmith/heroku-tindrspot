import React, { useState } from 'react';
import axios from 'axios';

function Logout() {

    const [logout, logoutuser] = useState(false);

    async function logUserOut() {
        if (logout === false) {
            await axios('http://localhost:8888/API/logout');
            logoutuser(true);
        }
    }

    return (
        <div>
            <button onClick={() => logUserOut()}>Logout of Express-Session</button>
        </div>    
        )
}

export default Logout;