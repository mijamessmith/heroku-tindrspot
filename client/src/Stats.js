import React, { useState } from 'react'
import info from './assets/images/information.svg';
import Graph from './Graph';
import { getTracksFromPlaylist } from "./APIController"


export default function Stats(props) {
    var { authToken, playlistId } = props;
    const [visible, changeVisible] = useState(false)
    const [stats, setStats] = useState(null);

    const handleClick = async () => {
        let playlist = await getTracksFromPlaylist(authToken, playlistId);
        console.log(playlist)
        
        changeVisible(!visible);
    }

    return (
        <div className='Stats'>
            <button className="Stats-btn" onClick={handleClick}>Stats</button>
            {visible ?
                <Graph
                    toggle={handleClick}
                    width={400}
                    height={400}


                />
                : null
            }
        </div>
    )
}